const { Text, Select, Relationship, File, Url } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { ImageAdapter } = require('../../lib/ImageAdapter')
const { LocalFileAdapter } = require('@keystonejs/file-adapters')
const fs = require('fs')
const { admin, moderator, editor, allowRoles } = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')
const gcsDir = 'assets/images/'
const addWatermark = require('../../helpers/watermark')

const fileAdapter = new LocalFileAdapter({
    src: './public/images',
    path: 'https://storage.googleapis.com/static-readr-tw-dev/assets/images', //function({id, }){}
    // path: 'https://www.readr.tw/assets/images', //function({id, }){}
})

const formatImagePath = (data) => {
    // check whether file has contained folder path in filename
    // 5ff2779.jpg ==> need to format
    // 5ff2779/5ff2779.jpg ==> return original filename
    const { filename } = data.file
    let id = filename.split('.')[0].split('-')[0]
    let ext = filename.split('.')[1]

    // No matter what the path or name is, just return this format's filename
    const newFilename = `${id}.${ext}`
    console.log('newFilename')
    console.log(newFilename)
    return newFilename
}

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
        defaultColumns: 'name, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // Hooks for create and update operations

        beforeChange: async ({ existingItem, resolvedData }) => {
            var origFilename
            if (typeof resolvedData.file !== 'undefined') {
                // resolvedData = true
                // when create or update newer image
                let fullFileName = resolvedData.file.filename
                let origFilename = resolvedData.file.originalFilename
                var id = resolvedData.file.id

                // add needWatermark to image (Todo)
                if (resolvedData.needWatermark) {
                    // stream = await addWatermark(
                    //     stream,
                    //     resolvedData.file.id,
                    //     resolvedData.file.originalFilename
                    // )
                }

                var stream = fs.createReadStream(`./public/images/${fullFileName}`)
                // upload image to gcs,and generate corespond meta data(url )
                const imageAdapter = new ImageAdapter(fullFileName)
                await imageAdapter.uploadImages(stream)

                // upload image to gcs,and generate corespond meta data(url )
                const image_adapter = new ImageAdapter(gcsDir)
                let _meta = await image_adapter.sync_save(stream, id, origFilename)

                resolvedData.urlOriginal = _meta.url.urlOriginal
                resolvedData.urlDesktopSized = _meta.url.urlDesktopSized
                resolvedData.urlMobileSized = _meta.url.urlMobileSized
                resolvedData.urlTabletSized = _meta.url.urlTabletSized
                resolvedData.urlTinySized = _meta.url.urlTinySized

                // existingItem = null
                // create image
                if (typeof existingItem === 'undefined') {
                    console.log('---create image---')
                } else {
                    console.log('---update image---')

                    // existingItem = true
                    // update image
                    // need to delete old image in gcs
                    await image_adapter.delete(
                        existingItem.file.id,
                        existingItem.file.originalFilename
                    )
                    console.log('deleted old one')
                }

                // update stored filename
                // filename ex: 5ff2779ebcfb3420789bf003-image.jpg

                const newFilename = formatImagePath(resolvedData)
                resolvedData.file.filename = newFilename

                // resolvedData.file.filename = newFilename

                return { existingItem, resolvedData }
            } else {
                // resolvedData = false
                // image is no needed to update
                console.log('no need to update stream')

                resolvedData.file = existingItem.file
                const newFilename = formatImagePath(existingItem)
                resolvedData.file.filename = newFilename

                console.log('EXISTING ITEM', existingItem)
                console.log('RESOLVED DATA', resolvedData)

                return { existingItem, resolvedData }
            }
        },
        // When delete image, delete image in gcs as well
        beforeDelete: async ({ existingItem }) => {
            const image_adapter = new ImageAdapter(gcsDir)

            if (existingItem && typeof existingItem.file !== 'undefined') {
                await image_adapter.delete(existingItem.file.id, existingItem.file.originalFilename)
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
