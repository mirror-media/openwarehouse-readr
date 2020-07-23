const { Integer, Slug, Text, DateTime, Relationship, Select } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, allowRoles } = require('../../helpers/readrAccess');
const cacheHint = require('../../helpers/cacheHint');

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '專題名稱',
            type: Text,
            isRequired: true,
        },
        description: {
            label: '描述',
            type: Text,
        },
        writers: {
            label: '作者',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'active, inactive, archived',
            defaultValue: 'inactive',
        },
        publishTime: {
            label: '發佈時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
            defaultValue: new Date().toISOString(),
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
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
        defaultColumns: 'sortOrder,title, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}