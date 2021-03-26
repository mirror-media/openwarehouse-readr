const {
    Relationship,
    Slug,
    Text,
    Url,
    Virtual,
    Integer,
} = require('@keystonejs/fields')
const { gql } = require('apollo-server-express')

const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const ImageRelationship = require('../../fields/ImageRelationship')

const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '節目名稱',
            type: Text,
            isRequired: true,
        },
        bannerImg: {
            label: 'banner',
            type: ImageRelationship,
            ref: 'Image',
            many: false,
            isRequired: true,
        },
        picture: {
            label: '圖片',
            type: ImageRelationship,
            ref: 'Image',
            many: false,
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
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
        // trailerUrl: {
        //     label: '預告片連結',
        //     type: Url,
        // },
        // youtubePlaylistUrl: {
        //     label: 'Youtube 節目播放清單連結',
        //     type: Url,
        //     isRequired: true,
        // },
        playList01: {
            label: 'Youtube播放清單1',
            type: Url,
        },
        playList02: {
            label: 'Youtube播放清單2',
            type: Url,
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
        defaultColumns: 'schedule, time, updatedAt',
        defaultSort: '-updatedAt',
    },
    labelField: 'id',
    cacheHint: cacheHint,
}
