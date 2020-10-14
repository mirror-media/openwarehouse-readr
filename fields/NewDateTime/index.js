// exports a field definition.
const {
    NewDateTime,
    MongoIntegerInterface,
    KnexIntegerInterface,
} = require('./Implementation')

// We're going to extend the integer field to store
// a number between 1-5 and represent this as a rating
const { Text } = require('@keystonejs/fields')

module.exports = {
    type: 'NewDateTime',
    implementation: NewDateTime, // back-end code used by Keystone
    views: {
        // front-end code used in either the Admin UI or GraphQL apps
        Controller: Text.views.Controller,
        Field: require.resolve('./views/Field'),
        // Field: Text.views.Field,

        Filter: Text.views.Filter,
        Cell: Text.views.Cell,
    },
    adapters: {
        // back-end code used by Keystone
        mongoose: MongoIntegerInterface,
        knex: KnexIntegerInterface,
    },
}
