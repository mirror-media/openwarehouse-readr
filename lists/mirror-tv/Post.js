const { Slug, Text, Checkbox, Select, Relationship } = require('@keystonejs/fields')
const NewDateTime = require('../../fields/NewDateTime/index.js')

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

const { createApolloFetch } = require('apollo-fetch')
const { gql } = require('graphql-tag')
const { logging } = require('@keystonejs/list-plugins')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})

const handleEditLog = async (arg) => {
    console.log('===I am handleEditLog===')
    let operation
    let postId
    let changedList
    switch (arg.operation) {
        case 'create':
            operation = 'create'
            postId = arg.createdItem.id
            changedList = JSON.stringify(arg.createdItem)

            break
        case 'update':
            operation = 'update'
            postId = arg.changedItem.id
            changedList = JSON.stringify(arg.changedItem)

            break
        case 'delete':
            operation = 'delete'
            postId = arg.deletedItem.id
            changedList = JSON.stringify(arg.deletedItem)

            break

        default:
            break
    }
    const nowUnixTimestamp = Date.now()
    const nowISO8601 = new Date(nowUnixTimestamp)

    const CREATE_LOG_LIST = `
    mutation CreateLogList(
      $name: String!
      $operation:String!
      $editTime: DateTime!
      $postId: String!
      $changedList: String!
    ) {
      createEditLog(
        data: {
          name: $name
          operation:$operation
          editTime: $editTime
          postId: $postId
          changedList: $changedList
        }
      ) {
        name
      }
    }
  `
    // fetch origin data(Todo)
    const variables = {
        name: arg.authedItem.name,
        operation: arg.operation,
        editTime: nowISO8601,
        postId: postId,
        changedList: changedList,
    }
    //   upload EditLog
    console.log('creating EditLog!!!!(Todo)')
    console.log(variables)
    // fetch({
    //     query: CREATE_LOG_LIST,
    //     variables: variables,
    // })
    //     .then((res) => {
    //         //   console.log(res)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
}

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
            defaultValue: 'untitled',
        },
        subtitle: {
            label: '副標',
            type: Text,
            defaultValue: '',
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
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        writers: {
            label: '作者',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        photographers: {
            label: '攝影',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        cameraOperators: {
            label: '影音',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        designers: {
            label: '設計',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        engineers: {
            label: '工程',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        vocals: {
            label: '主播',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        otherbyline: {
            label: '作者（其他）',
            type: Text,
            defaultValue: '',
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
        },
        heroCaption: {
            label: '首圖圖說',
            type: Text,
            defaultValue: '',
        },
        heroImageSize: {
            label: '首圖尺寸',
            type: Select,
            options: 'extend, normal, small',
            defaultValue: 'normal',
            /*dependsOn: {
                heroImage: {
                    '$regex': '.+/i'
                }
            }*/
        },
        style: {
            label: '樣式',
            type: Select,
            options: 'article, videoNews, wide, projects, photography, script, campaign, readr',
            // defaultValue: 'article'
            defaultValue: 'article',
        },
        brief: {
            label: '前言',
            type: HTML,
        },
        content: {
            label: '內文',
            type: HTML,
        },
        topics: {
            label: '專題',
            type: Relationship,
            ref: 'Topic',
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        audio: {
            label: '音檔',
            type: Relationship,
            ref: 'Audio',
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        relatedTopic: {
            label: '相關專題',
            type: Relationship,
            ref: 'Topic',
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
            defaultValue: '',
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
            defaultValue: '',
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
        },
        adTraceCode: {
            label: '追蹤代碼',
            type: Text,
            isMultiline: true,
            defaultValue: '',
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox,
        },
        isAdult: {
            label: '18禁',
            type: Checkbox,
        },
        isAdvertised: {
            label: '廣告文案',
            type: Checkbox,
        },
        isAdBlocked: {
            label: 'Google 廣告違規',
            type: Checkbox,
        },
        lockTime: {
            type: NewDateTime,
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentHtml: {
            type: Text,
            label: 'Content HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentApiData: {
            type: Text,
            label: 'Content API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        source: {
            type: Text,
            label: '來源',
            adminConfig: {
                isReadOnly: true,
            },
        },
    },
    plugins: [logging((args) => handleEditLog(args)), atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {
        beforeChange: async ({ existingItem, resolvedData }) => {
            try {
                const waitingForParse = resolvedData.content || existingItem.content
                const content = JSON.parse(waitingForParse)

                console.log(content)

                resolvedData.contentHtml = content.html
                resolvedData.contentApiData = JSON.stringify(content.apiData)
                delete content['html']
                delete content['apiData']
                resolvedData.content = content
                return { existingItem, resolvedData }
            } catch (err) {
                console.log(err)
                console.log('EXISTING ITEM')
                console.log(existingItem)
                console.log('RESOLVED DATA')
                console.log(resolvedData)
            }
        },
    },
    adminConfig: {
        defaultColumns: 'slug, name, state, categories, createdBy, publishTime, updatedAt',
        defaultSort: '-publishTime',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
