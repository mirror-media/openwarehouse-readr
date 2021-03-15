const { Text, Checkbox, Password, Select } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    owner,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')

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
        },
        role: {
            label: '角色權限',
            type: Select,
            dataType: 'string',
            options: 'contributor, author, editor, moderator, admin',
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
    access: {
        read: allowRoles(admin, moderator, editor, owner),
        update: allowRoles(admin, moderator, owner),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
        auth: true,
    },
    hooks: {
        validateInput: async ({
            operation,
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            if (operation === 'update' && existingItem.isProtected) {
                const protectedFields = ['name', 'email', 'role']
                const changedFields = []
                protectedFields.forEach((field) => {
                    if (
                        resolvedData[field] &&
                        resolvedData[field] !== existingItem[field]
                    ) {
                        changedFields.push(field)
                    }
                })

                addValidationError(
                    `此帳號已啟動「受保護」，${changedFields.join(
                        '、'
                    )}欄位不能被更動。如需更動，需先取消選取「受保護」再執行。`
                )
            }
        },
    },
    adminConfig: {
        defaultColumns: 'name, email, role, isProtected, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
