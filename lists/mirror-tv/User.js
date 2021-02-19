const { Text, Checkbox, Password, Select, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, moderator, editor, owner, allowRoles } = require('../../helpers/access/mirror-tv')

module.exports = {
    fields: {
        name: {
            label: '姓名',
            type: Text,
            isRequired: true,
        },
        email: {
            label: 'Email',
            type: Text,
            isRequired: true,
            isUnique: true,
        },
        password: {
            label: '密碼',
            type: Password,
            access: {
                update: allowRoles(admin, moderator, owner),
            },
        },
        role: {
            label: '角色權限',
            type: Select,
            dataType: 'string',
            options: 'admin, author, bot, contributor, editor, moderator',
            defaultValue: 'contributor',
            isRequired: true,
            access: {
                update: allowRoles(admin, moderator),
            },
        },
        isProtected: {
            label: '受保護',
            type: Checkbox,
            access: {
                update: allowRoles(admin),
            },
        },
    },
    plugins: [atTracking(), byTracking()],
    // access: {
    //     read: allowRoles(admin, moderator, owner),
    //     update: allowRoles(admin, moderator, owner),
    //     create: allowRoles(admin, moderator),
    //     delete: allowRoles(admin),
    // },
    hooks: {
        resolveInput: async ({ operation, existingItem, resolvedData }) => {
            if (operation === 'update' && existingItem.isProtected) {
                const protectedFields = ['name', 'email', 'isAdmin', 'role']
                protectedFields.forEach((field) => {
                    resolvedData[field] = existingItem[field]
                })
            }
            return resolvedData
        },
    },
    adminConfig: {
        defaultColumns: 'name, email, role, isAdmin, company, createdAt',
        defaultSort: '-createdAt',
    },
}
