const { Slug, Text, Checkbox, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, editor, contributor, owner, allowRoles } = require('../helpers/mirrormediaAccess');
const publishStateExaminer = require('../hooks/publishStateExaminer');

module.exports = {
    fields: {
        slug: {
            label: "Slug",
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        title: {
            label: "名稱",
            type: Text,
            isRequired: true
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image'
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {
        resolveInput: publishStateExaminer,
    },
    adminConfig: {
        defaultColumns: 'slug, title, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
}