const { Integer, Text, Relationship, Select } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, moderator, allowRoles } = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')
const HTML = require('../../fields/HTML')
const NewDateTime = require('../../fields/NewDateTime/index.js')

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            // isUnique: true,
        },
        slug: {
            label: 'slug',
            type: Text,
            isRequired: false,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        subtitle: {
            label: '副標',
            type: Text,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived',
            defaultValue: 'draft',
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hooks: {
                validateInput: async ({
                    resolvedData,
                    addFieldValidationError,
                }) => {
                    console.log('I am validateInput in publishTime')
                    console.log(resolvedData.publishTime)
                    console.log(typeof resolvedData.publishTime)

                    const { state, publishTime } = resolvedData
                },
            },
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
            ref: 'Author',
            many: true,
        },
        photographers: {
            label: '攝影',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        cameraOperators: {
            label: '影音',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        designers: {
            label: '設計',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        engineers: {
            label: '工程',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        dataAnalysts: {
            label: '數據分析',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        otherByline: {
            label: '作者（其他）',
            type: Text,
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
        },
        style: {
            label: '樣式',
            type: Select,
            options: 'reviews, news, report, memo, dummy, card, qa',
        },
        summary: {
            label: '重點摘要',
            type: HTML,
        },
        brief: {
            label: '前言',
            type: HTML,
        },
        content: {
            label: '內文',
            type: HTML,
        },
        wordCount: {
            label: '字數',
            type: Integer,
        },
        projects: {
            label: '專題',
            type: Relationship,
            ref: 'Project',
            many: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
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
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'sortOrder,name, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // validateInput: async ({ resolvedData, addFieldValidationError }) => {
        //     console.log('I am validateInput in post list')
        //     console.log(resolvedData)
        //     console.log(typeof resolvedData.publishTime)

        //     const { state, publishTime } = resolvedData
        //     addFieldValidationError('time is not undefined')

        //     if (typeof publishTime === 'undefined') {
        //         addFieldValidationError('time is undefined')
        //     }
        // },

        beforeChange: async ({ existingItem, resolvedData }) => {
            console.log('---beforeChange---')
            try {
                const waitingForParse =
                    resolvedData.content || existingItem.content

                resolvedData.contentHtml = JSON.parse(waitingForParse).html
                resolvedData.contentApiData = JSON.stringify(
                    JSON.parse(waitingForParse).apiData
                )
                console.log(typeof content.apiData)
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
    labelField: 'name',
    cacheHint: cacheHint,
}
