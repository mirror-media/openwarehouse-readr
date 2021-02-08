const { Text, DateTime } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, allowRoles } = require('../../helpers/access/mirror-tv')

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
        editTime: {
            label: '編輯時間',
            type: DateTime,
            format: 'dd/MM/yyyy HH:mm Z',
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
            label: '更動內容',
            type: Text,
            isMultiline: true,
            adminConfig: {
                isReadOnly: true,
            },
        },
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
