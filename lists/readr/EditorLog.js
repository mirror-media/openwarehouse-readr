const { Slug, Text, Url, Relationship } = require('@keystonejs/fields')
const { Markdown } = require('@keystonejs/fields-markdown')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, moderator, allowRoles } = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        name: {
            label: '姓名',
            type: Text,
            isRequired: true,
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin),
        create: allowRoles(admin),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
