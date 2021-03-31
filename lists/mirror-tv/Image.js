const {
    Text,
    Select,
    Relationship,
    File,
    Url,
    Checkbox,
} = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { ImageAdapter } = require('../../lib/ImageAdapter')
const { LocalFileAdapter } = require('@keystonejs/file-adapters')
const fs = require('fs')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const gcsDir = 'assets/images/'
const { addWatermarkIfNeeded } = require('../../utils/watermarkHandler')
const { getNewFilename } = require('../../utils/getNewFilename')

const fileAdapter = new LocalFileAdapter({
    src: './public/images',
    path: 'https://storage.googleapis.com/static-mnews-tw-dev/assets/images', //function({id, }){}
    // path: 'https://www.readr.tw/assets/images', //function({id, }){}
})

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: fileAdapter,
            isRequired: true,
        },
        copyright: {
            label: '版權',
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted',
            defaultValue: 'Copyrighted',
        },
        topic: {
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
        needWatermark: {
            label: 'Need watermark?',
            type: Checkbox,
        },
        keywords: {
            label: '關鍵字',
            type: Text,
        },
        meta: {
            label: '中繼資料',
            type: Text,
        },
        urlOriginal: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        urlDesktopSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        urlTabletSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        urlMobileSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        urlTinySized: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
        imageApiData: {
            type: Text,
            access: {
                create: false,
                update: false,
            },
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        // update: allowRoles(admin, moderator, editor),
        // create: allowRoles(admin, moderator, editor),
        // delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // Hooks for create and update operations

        beforeChange: async ({ existingItem, resolvedData }) => {
            try {
                if (typeof resolvedData.file !== 'undefined') {
                    // resolvedData = true
                    // when create or update newer image
                    const originalFileName = resolvedData.file.filename //image's name format: id-orgName.ext
                    const newFileName = getNewFilename(resolvedData)
                    const id = resolvedData.file.id

                    await addWatermarkIfNeeded(resolvedData, existingItem)

                    // upload image to gcs,and generate corespond meta data(url )
                    const image_adapter = new ImageAdapter(
                        originalFileName,
                        newFileName,
                        id
                    )
                    let _meta = await image_adapter.sync_save()

                    // existingItem = true
                    // update image
                    // need to delete old image in gcs
                    if (typeof existingItem !== 'undefined') {
                        console.log('---update image---')

                        await image_adapter.delete(
                            existingItem.file.id,
                            existingItem.file.originalFilename
                        )
                        console.log('deleted old one')
                    }

                    // import each url into resolvedData
                    resolvedData.urlOriginal = _meta.apiData.original.url
                    resolvedData.urlDesktopSized = _meta.apiData.desktop.url
                    resolvedData.urlTabletSized = _meta.apiData.tablet.url
                    resolvedData.urlMobileSized = _meta.apiData.mobile.url
                    resolvedData.urlTinySized = _meta.apiData.tiny.url
                    // generate imageApiData to resolvedData
                    resolvedData.imageApiData = JSON.stringify(_meta.apiData)
                    // update stored filename
                    // filename ex: 5ff2779ebcfb3420789bf003-image.jpg
                    resolvedData.file.filename = getNewFilename(resolvedData)
                } else {
                    // resolvedData = false
                    // image is no needed to update
                    console.log('no need to update stream')
                }

                return { existingItem, resolvedData }
            } catch (err) {
                console.log(err)
            }
        },
        // When delete image, delete image in gcs as well
        beforeDelete: async ({ existingItem }) => {
            const image_adapter = new ImageAdapter(gcsDir)

            if (existingItem && typeof existingItem.file !== 'undefined') {
                await image_adapter.delete(
                    existingItem.file.id,
                    existingItem.file.originalFilename
                )
                console.log('deleted old one')
            }
        },
        /*
        resolveInput: ({ operation, existingItem, resolvedData, originalInput }) => {
            if (resolvedData.file) {
                resolvedData.urlOriginal = resolvedData.file._meta.url.urlOriginal
                resolvedData.urlDesktopSized = resolvedData.file._meta.url.urlDesktopSized
                resolvedData.urlMobileSized = resolvedData.file._meta.url.urlMobileSized
                resolvedData.urlTabletSized = resolvedData.file._meta.url.urlTabletSized
                resolvedData.urlTinySized = resolvedData.file._meta.url.urlTinySized
            }

            console.log("resolveInput RESOLVED DATA", resolvedData)
            return resolvedData
        },
		*/
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
