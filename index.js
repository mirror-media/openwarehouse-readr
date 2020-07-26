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
const { RedisCache } = require('apollo-server-cache-redis');
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
      return new ioredis({
        port: redisConf.nodes[0].port, // First Redis port
        host: redisConf.nodes[0].host, // First Redis host
        password: redisConf.authPass,
      });
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
  if (!app.isRedisCacheRequired) {
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

const graphQLOptions = app.isRedisCacheRequired ? {
  apollo: {
    ...apolloDftOptions,
    cache: new RedisCache({
      // Default ttl is 300. Change it to tweek performance
      host: redisConf.host,
      port: redisConf.port,
      password: redisConf.authPass,
      keyPrefix: `${app.uuid}-cache:`,
    }),
    plugins: [responseCachePlugin()],
  },
} : {
    apollo: apolloDftOptions,
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
