const { Slug, Text, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, editor, contributor, owner, allowRoles } = require('../../helpers/mirrormediaAccess');
const publishStateExaminer = require('../../hooks/publishStateExaminer');
const cacheHint = require('../../helpers/cacheHint');

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        display: {
            label: '中文名稱',
            type: Text,
            isRequired: true
        },
        website: {
            label: 'Website',
            tybel: '網址',
            type: Url
        },
        isPublic: {
            label: '公開',
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
        defaultColumns: 'slug, display, website, isPublic, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'display',
    cacheHint: cacheHint,
}