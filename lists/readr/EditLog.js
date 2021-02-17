const { Text, DateTime } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, allowRoles } = require('../../helpers/access/mirror-tv')
const HTML = require('../../fields/HTML')

module.exports = {
    fields: {
        name: {
            label: '編輯者',
            type: Text,
            isRequired: true,
            adminConfig: {
                isReadOnly: true,
            },
        },
        operation: {
            label: '動作',
            type: Text,
            adminConfig: {
                isReadOnly: true,
            },
        },
        postId: {
            label: '文章ID',
            type: Text,
            adminConfig: {
                isReadOnly: true,
            },
        },
        changedList: {
            label: '欄位更動內容',
            type: Text,
            isMultiline: true,
            adminConfig: {
                isReadOnly: true,
            },
        },
        // summary: {
        //     label: '已更動重點摘要',
        //     type: HTML,
        //     adminConfig: {
        //         isReadOnly: true,
        //     },
        // },
        // brief: {
        //     label: '已更動前言',
        //     type: HTML,
        //     adminConfig: {
        //         isReadOnly: true,
        //     },
        // },
        // content: {
        //     label: '已更動內文',
        //     type: HTML,
        //     adminConfig: {
        //         isReadOnly: true,
        //     },
        // },
    },
    plugins: [atTracking({ format: 'MM/DD/YYYY h:mm OOOO' }), byTracking()],
    access: {
        update: allowRoles(admin),

        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, operation, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
