const { Relationship, Url } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, allowRoles } = require('../helpers/readrAccess');
const cacheHint = require('../helpers/cacheHint');

module.exports = {
    fields: {
        data: {
            label: '所使用 Data',
            type: Relationship,
            ref: 'Data',
        },
        link: {
            label: '連結',
            type: Url,
        },
        writers: {
            label: '作者',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}