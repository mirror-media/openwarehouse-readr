const { Integer, Text, Select, Relationship, DateTime } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, allowRoles } = require('../helpers/readrAccess');
const cacheHint = require('../helpers/cacheHint');

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true
        },
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        writer: {
            label: '作者',
            type: Relationship,
            ref: 'Author'
        },
        byline: {
            label: '引自',
            type: Text,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft'
        },
        publishedTime: {
            label: '發佈時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
            defaultValue: new Date().toISOString(),
            /*dependsOn: {
                '$or': {
                    state: [
                        'published',
                        'scheduled'
                    ]
                }
            }*/
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
        defaultColumns: 'title, writer, byline, state, publishedTime, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}