const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { app, database, session, redis: redisConf } = require('./configs/config.js')
const lists = require(`./lists/${app.project}`);
const createDefaultAdmin = require('./helpers/createDefaultAdmin')

const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const { RedisCache, RedisClusterCache } = require('apollo-server-cache-redis');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const ioredis = require("ioredis");

const adapterConfig = {
  dropDatabase: app.dropDatabase,
  knexOptions: {
    client: 'postgres',
    connection: `postgresql://${database.acc}:${database.pass}@${database.host}/${database.db}`,
  }
};

const newRedisClient = (redisConf) => {
  const { options } = redisConf;
  switch (redisConf.type) {
    case 'single':
      return redis.createClient({
        host: redisConf.nodes[0].host,
        port: redisConf.nodes[0].port,
        auth_pass: options.authPass,
        prefix: `${app.uuid}-`,
      });
    /* return new ioredis({
      port: redisConf.nodes[0].port, // First Redis port
      host: redisConf.nodes[0].host, // First Redis host
    }, {
      password: options.authPass,
    }); */
    case 'cluster':
      return new ioredis.Cluster(
        redisConf.nodes,
        {
          scaleReads: options.scaleReads,
          redisOptions: {
            password: options.authPass,
          },
        },
      );
    default:
      return null;
  }
};

const keystone = new Keystone({
  name: app.applicationName,
  adapter: new Adapter(adapterConfig),
  cookieSecret: session.cookieSecret,
  onConnect: createDefaultAdmin(app.project),
  sessionStore: new RedisStore({
    client: newRedisClient(redisConf),
    ttl: session.ttl,
    prefix: `${app.uuid}-ss:`,
  })
});

for (var name in lists) {
  // Remove cacheHint if we want users to reach realtime data
  if (!app.isGraphQLCached) {
    delete lists[name].cacheHint;
  }
  keystone.createList(name, lists[name]);
}

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: app.authList,
});

// Default apollo options
const apolloDftOptions = {
  introspection: true,
}

// apollo Redis cache options
const apolloRedisCacheOptions = {};
if (app.isGraphQLCached) {
  const { options } = redisConf;
  const keyPrefix = `${app.uuid}-cache:`;
  switch (redisConf.type) {
    case 'single':
      apolloRedisCacheOptions.plugins = [responseCachePlugin()];
      apolloRedisCacheOptions.cache = new RedisCache({
        host: redisConf.nodes[0].host,
        port: redisConf.nodes[0].port,
        password: options.authPass,
        keyPrefix: keyPrefix,
      });
      break;
    case 'cluster':
      apolloRedisCacheOptions.plugins = [responseCachePlugin()];
      apolloRedisCacheOptions.cache = new RedisClusterCache(
        redisConf.nodes,
        {
          scaleReads: options.scaleReads,
          redisOptions: {
            password: options.authPass,
            prefix: keyPrefix,
          },
        },
      );
      break;
    default:
      throw 'wrong redis type'
  }
}


const graphQLOptions = {
  apollo: {
    ...apolloDftOptions,
    ...apolloRedisCacheOptions,
  },
};

let optionalApps = []

if (app.isAdminAppRequired) {
  optionalApps.push(new AdminUIApp({
    enableDefaultRoute: true,
    hooks: require.resolve(`./hooks/${app.project}`),
    authStrategy,
  }));
}

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(graphQLOptions),
    ...optionalApps,
  ],
};
