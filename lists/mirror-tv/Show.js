const {
  Relationship,
  Slug,
  Text,
  Url,
  Virtual,
} = require('@keystonejs/fields')
const { gql } = require('apollo-server-express');

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

module.exports = {
  fields: {
    slug: {
      label: 'Slug',
      type: Slug,
      isRequired: true,
      isUnique: true,
    },
    schedule: {
      label: '節目名稱',
      type: Relationship,
      ref: 'Schedule',
      many: false,
      isRequired: true,
    },
    bannerImg: {
      label: 'banner',
      type: Relationship,
      ref: 'Image',
      many: false,
      isRequired: true,
    },
    picture: {
      label: '圖片',
      type: Relationship,
      ref: 'Image',
      many: false,
    },
    time: {
      label: '播放時間',
      type: Virtual,
      resolver: async (item, args, context) => {
        const { data, errors } = await context.executeGraphQL({
          query: gql`
                    {
                        Schedule(where: {id: ${item.schedule}}) {
                            monday
                            tuesday
                            wednesday
                            thursday
                            friday
                            saturday
                            sunday
                            hour
                            minute
                        }
                    }`
        })
        const weekdays = Object.keys(data.Schedule)
          .filter(key => key != 'hour' && key != 'minute' && !!data.Schedule[key])
          .map(weekday => weekday.charAt(0).toUpperCase() + weekday.slice(1))
        const timeString = ('0' + data.Schedule.hour).slice(-2) + ':' + ('0' + data.Schedule.minute).slice(-2)
        return `${[weekdays.join(', '), timeString].join(' ')}`
      }
    },
    introduction: {
      label: '簡介',
      type: Text,
      isMultiline: true,
    },
    hostName: {
      label: '主持人姓名',
      type: Relationship,
      ref: 'Contact',
      many: true,
    },
    facebookUrl: {
      label: 'facebook 粉專連結',
      type: Url,
    },
    trailerUrl: {
      label: '預告片連結',
      type: Url,
    },
    youtubePlaylistUrl: {
      label: 'Youtube 節目播放清單連結',
      type: Url,
      isRequired: true,
    },
  },
  plugins: [atTracking(), byTracking()],
  access: {
    update: allowRoles(admin, moderator),
    create: allowRoles(admin, moderator),
    delete: allowRoles(admin),
  },
  hooks: {},
  adminConfig: {
    defaultColumns:
      'schedule, time, updatedAt',
    defaultSort: '-updatedAt',
  },
  labelField: 'id',
  cacheHint: cacheHint,
}
