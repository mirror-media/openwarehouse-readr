const { Slug, Text, Relationship, Select, Url } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
  admin,
  moderator,
  editor,
  contributor,
  owner,
  allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const NewDateTime = require('../../fields/NewDateTime/index.js')

module.exports = {
  fields: {
    slug: {
      label: 'Slug',
      type: Slug,
      isRequired: true,
      isUnique: true,
    },
    partner: {
      label: '合作單位',
      type: Relationship,
      ref: 'Partner',
    },
    title: {
      label: '標題',
      type: Text,
      isRequired: true,
      defaultValue: 'untitled',
    },
    subtitle: {
      label: '副標',
      type: Text,
    },
    state: {
      label: '狀態',
      type: Select,
      options: 'draft, published, scheduled, archived, invisible',
      defaultValue: 'draft',
    },
    publishTime: {
      label: '發佈時間',
      type: NewDateTime,
    },
    byline: {
      label: '作者',
      type: Text,
    },
    thumbnail: {
      label: '縮圖',
      type: Url,
    },
    brief: {
      label: '前言',
      type: Text,
      isMultiline: true,
    },
    content: {
      label: '內文',
      type: Text,
      isMultiline: true,
    },
    source: {
      label: '原文網址',
      type: Url,
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
    defaultColumns: 'title, slug, state, createdBy, publishTime',
    defaultSort: '-publishTime',
  },
  labelField: 'title',
  cacheHint: cacheHint,
}
