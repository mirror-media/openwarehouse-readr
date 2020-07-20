const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { app, database, session, redis: redisConf } = require('./configs/config.js')
const lists = require(`./lists/index.js`);
const createDefaultAdmin = require('./helpers/createDefaultAdmin')

const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const { RedisCache } = require('apollo-server-cache-redis');
const responseCachePlugin = require('apollo-server-plugin-response-cache');

const adapterConfig = {
  dropDatabase: app.dropDatabase,
  knexOptions: {
    client: 'postgres',
    connection: `postgresql://${database.acc}:${database.pass}@${database.host}/${database.db}`,
  }
};

const keystone = new Keystone({
  name: app.applicationName,
  adapter: new Adapter(adapterConfig),
  cookieSecret: session.cookieSecret,
  onConnect: createDefaultAdmin(app.project),
  sessionStore: new RedisStore({
    client: redis.createClient({
      host: redisConf.host,
      port: redisConf.port,
      auth_pass: redisConf.authPass,
      prefix: `${app.uuid}-`,
    }),
    options: {
      ttl: session.ttl
    }
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


const graphQLOptions = app.isRedisCacheRequired ? {
  apollo: {
    cache: new RedisCache({
      // Default ttl is 300. Change it to tweek performance
      host: redisConf.host,
      port: redisConf.port,
      password: redisConf.authPass,
      keyPrefix: `${app.uuid}-cache:`,
    }),
    plugins: [responseCachePlugin()],
  },
} : {};

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
