const { Text, Select, Relationship, File, Url } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { ImageAdapter } = require('../../lib/ImageAdapter')
const { LocalFileAdapter } = require('@keystonejs/file-adapters')
const fs = require('fs')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')
const gcsDir = 'assets/images/'
const addWatermark = require('../../helpers/watermark')

module.exports = {
    fields: {
        title: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: new LocalFileAdapter({
                src: './public/images',
                path: '/images', //function({id, }){}
            }),
            isRequired: true,
        },
        copyright: {
            label: '版權',
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted, CC BY-SA 3.0',
            defaultValue: 'Copyrighted',
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        keywords: {
            label: '關鍵字',
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
        urlMobileSized: {
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
        urlTinySized: {
            type: Url,
            access: {
                create: false,
                update: false,
            },
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'title, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // Hooks for create and update operations

        beforeChange: async ({ existingItem, resolvedData }) => {
            console.log('BEFORE CHANGE')
            console.log('EXISTING ITEM', existingItem)
            console.log('RESOLVED DATA', resolvedData)
            var origFilename

            // resolvedData = true
            // when create or update newer image
            if (typeof resolvedData.file !== 'undefined') {
                var stream = fs.createReadStream(
                    `./public/images/${resolvedData.file.id}-${resolvedData.file.originalFilename}`
                )
                var id = resolvedData.file.id
                origFilename = resolvedData.file.originalFilename
                if (resolvedData.needWatermark) {
                    // stream = await addWatermark(
                    //     stream,
                    //     resolvedData.file.id,
                    //     resolvedData.file.originalFilename
                    // )
                }

                // upload image to gcs,and generate corespond meta data(url )
                const image_adapter = new ImageAdapter(gcsDir)
                let _meta = image_adapter.sync_save(stream, id, origFilename)
                resolvedData.urlOriginal = _meta.url.urlOriginal
                resolvedData.urlDesktopSized = _meta.url.urlDesktopSized
                resolvedData.urlMobileSized = _meta.url.urlMobileSized
                resolvedData.urlTabletSized = _meta.url.urlTabletSized
                resolvedData.urlTinySized = _meta.url.urlTinySized

                // existingItem = true
                // create image
                if (existingItem.file === 'undefined') {
                } else {
                    // existingItem = true
                    // update image
                    // need to delete old image in gcs
                    await image_adapter.delete(
                        existingItem.file.id,
                        existingItem.file.originalFilename
                    )
                    console.log('deleted old one')
                }

                // // update stored filename
                // // filename ex: 5ff2779ebcfb3420789bf003-image.jpg
                // const filename = resolvedData.file.filename
                // const folderName = filename.split('-')[0]
                // // check whether file has contained folder path in filename
                // if (folderName === resolvedData.file.id) {
                //     return { existingItem, resolvedData }
                // }

                // const newFilename = `${folderName}/${filename}`
                // resolvedData.filename = newFilename

                return { existingItem, resolvedData }
            } else {
                // resolvedData = false
                // image is no needed to update
                console.log('no need to update stream')
                return { existingItem, resolvedData }
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
    labelField: 'title',
    cacheHint: cacheHint,
}
