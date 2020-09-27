const { Text, Select, Relationship, File, Url } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { ImageAdapter } = require('../../lib/ImageAdapter');
const { LocalFileAdapter } = require('@keystonejs/file-adapters')
const fs = require('fs')
const { admin, moderator, editor, allowRoles } = require('../../helpers/access/readr');
const cacheHint = require('../../helpers/cacheHint');
const gcsDir = 'assets/images/';

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
                src: './images', path: '/images', //function({id, }){}
            }),
            isRequired: true,
        },
		/*
        file: {
            label: '檔案',
            type: File,
            adapter: new ImageAdapter(gcsDir),
            isRequired: true,
        },
		*/
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
            }
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
    plugins: [
        atTracking(),
        byTracking(),
    ],
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
        beforeChange: async ({ existingItem, resolvedData }) => {
            console.log("BEFORE CHANGE")
            console.log("EXISTING ITEM", existingItem)
            console.log("RESOLVED DATA", resolvedData)


            if (typeof resolvedData.file != 'undefined') {
                var stream = fs.createReadStream(`./images/${resolvedData.file.id}-${resolvedData.file.originalFilename}`)
                var id = resolvedData.file.id
                if (resolvedData.needWatermark) {
                    stream = await addWatermark(stream, resolvedData.file.id, resolvedData.file.originalFilename)
                }

            } else if (typeof existingItem.file != 'undefined') {

                var stream = fs.createReadStream(`./images/${existingItem.file.id}-${existingItem.file.originalFilename}`)
                var id = existingItem.file.id
                if (existingItem.needWatermark) {
                    stream = await addWatermark(stream, existingItem.file.id, existingItem.file.originalFilename)
                }
            }

			console.log(stream.metadata())
            const image_adapter = new ImageAdapter(gcsDir)

            let _meta = image_adapter.sync_save(stream, id)
            if (resolvedData.file) {
                resolvedData.urlOriginal = _meta.url.urlOriginal
                resolvedData.urlDesktopSized = _meta.url.urlDesktopSized
                resolvedData.urlMobileSized = _meta.url.urlMobileSized
                resolvedData.urlTabletSized = _meta.url.urlTabletSized
                resolvedData.urlTinySized = _meta.url.urlTinySized
            }

            return { existingItem, resolvedData }
        }
        // Hooks for create and update operations
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
