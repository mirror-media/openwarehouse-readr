const { Text, DateTime } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, allowRoles } = require('../../helpers/access/mirror-tv')

module.exports = {
    fields: {
        name: {
            label: '編輯者',
            type: Text,
            isRequired: true,
        },
        operation: {
            label: '動作',
            type: Text,
        },
        editTime: {
            label: '編輯時間',
            type: DateTime,
            format: 'dd/MM/yyyy HH:mm O',
        },
        postId: {
            label: '文章ID',
            type: Text,
        },
        changedList: {
            label: '更動內容',
            type: Text,
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin),
        create: allowRoles(admin),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, operation, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
