const { Integer, Select, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
  admin,
  moderator,
  editor,
  contributor,
  owner,
  allowRoles,
} = require('../../helpers/access/mirror-tv')
const HTML = require('../../fields/HTML')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
  fields: {
    sortOrder: {
      label: '排序順位',
      type: Integer,
      isUnique: true,
    },
    choice: {
      label: '精選文章',
      type: Relationship,
      ref: 'Post',
    },
    state: {
      label: '狀態',
      type: Select,
      options: 'draft, published, scheduled, archived, invisible',
      defaultValue: 'draft',
    },
  },
  plugins: [atTracking(), byTracking()],
  access: {
    update: allowRoles(admin, moderator, editor, owner),
    create: allowRoles(admin, moderator, editor, contributor),
    delete: allowRoles(admin),
  },
  hooks: {},
  adminConfig: {
    defaultColumns: 'choice, state, createdAt',
    defaultSort: '-createdAt',
  },
  cacheHint: cacheHint,
}
