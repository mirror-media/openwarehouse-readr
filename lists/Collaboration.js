const { Integer, Text, DateTime, Relationship, Url, Select } = require('@keystonejs/fields');
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
        description: {
            label: '描述',
            type: Text
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image'
        },
        startTime: {
            label: '開始時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
            defaultValue: new Date().toISOString(),
            isRequired: true,
            yearPickerType: 'select' // this option seems not work
        },
        endTime: {
            label: '結束時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
        },
        progress: {
            label: '完成進度',
            type: Integer,
        },
        collabLink: {
            label: '協作連結',
            type: Url,
        },
        achvLink: {
            label: '結案成果連結',
            type: Url,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived',
            defaultValue: 'draft'
        },
        publishTime: {
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
        defaultColumns: 'title, description, progress, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}