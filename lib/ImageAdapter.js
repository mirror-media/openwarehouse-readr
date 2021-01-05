const { GCSAdapter } = require('./GCSAdapter.js')
// const im = require('imagemagick-stream') // not supported
const sharp = require('sharp')

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const {
    storage: { imgUrlBase },
} = require('../configs/config')
const resizeTarget = {
    tiny: { height: 84, width: 150 },
    mobile: { height: 450, width: 800 },
    tablet: { height: 675, width: 1200 },
    desktop: { height: 713, width: 1268 },
}

class ImageAdapter extends GCSAdapter {
    // No use
    async save({ stream, filename, mimetype, encoding, id }) {
        const nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
        const baseName = path.basename(filename)
        let _meta = {}
        let ext = baseName.split('.')[1]
        stream.pipe(fs.createWriteStream(`./${id}_local_tmp`))
        var url = {}
        //Save to GCS
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${id}-${key}.${ext}`

                switch (key) {
                    case 'tiny':
                        url.urlTinySized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
                    case 'mobile':
                        url.urlMobileSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
                    case 'tablet':
                        url.urlTabletSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
                    case 'desktop':
                        url.urlDesktopSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
                }
                this.saveGCS(resized_filename, stream, key)
            }
            this.saveOriginalSizedImage(nowtime, id, ext, stream, url)
        } catch (err) {
            console.log(err)
        }
        _meta.url = url
        return { id, filename, _meta }
    }

    sync_save(stream, id, origFilename) {
        let name = origFilename.split('.')[0]
        let ext = origFilename.split('.')[1]
        let _meta = {}
        var url = {}
        console.log('===sync_save===')

        this.saveOriginalSizedImage(id, name, ext, stream, url)
        this.saveVariusSizeImage(id, name, ext, stream, url)

        // after update to gcs, delete local image
        this.deleteLocalTempFile(id, origFilename)

        _meta.url = url

        return _meta
    }

    saveOriginalSizedImage(id, name, ext, stream, url) {
        const gcsUploadPath = `${this.gcsDir}${id}.${ext}`
        const originalSize = this.bucket.file(gcsUploadPath)

        const originalWrite = originalSize.createWriteStream(this.getOptions())
        stream.pipe(originalWrite)

        // create url which link to gcs
        url.urlOriginal = `${imgUrlBase}${gcsUploadPath}`
    }

    // determine which size is needed,
    // then start uploading and create related url
    saveVariusSizeImage(id, name, ext, stream, url) {
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${id}-${key}.${ext}`

                //Save image to gcs
                this.saveGCS(resized_filename, stream, key, id)

                // Create url which link to gcs
                this.createUrlToUrlObject(key, url, id, resized_filename)
            }
        } catch (err) {
            console.log(err)
        }
    }

    createUrlToUrlObject(key, url, id, resized_filename) {
        switch (key) {
            case 'tiny':
                url.urlTinySized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
            case 'mobile':
                url.urlMobileSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
            case 'tablet':
                url.urlTabletSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
            case 'desktop':
                url.urlDesktopSized = `${imgUrlBase}${this.gcsDir}${resized_filename}`
        }
    }

    saveGCS(resized_filename, stream, key, id) {
        const gcsUploadPath = `${this.gcsDir}${resized_filename}`
        console.log(gcsUploadPath)
        const file = this.bucket.file(gcsUploadPath) //get the upload path

        // const write = file.createWriteStream(this.getOptions(resized_filename))
        const write = file.createWriteStream()
        // const resize = im().set('density', 72)
        // .resize(`${resizeTarget[key].width}x${resizeTarget[key].height}`)
        // .quality(85)

        const resize = sharp()
            .resize(resizeTarget[key].width, resizeTarget[key].height, {
                fit: 'inside',
            })
            .webp({ quality: 85 })

        stream.pipe(resize).pipe(write) //resize and upload
    }

    deleteLocalTempFile(id, origFilename) {
        const localTempFilePath = `./public/images/${id}-${origFilename}`
        fs.unlink(localTempFilePath, (err) => {
            if (err) {
                throw err
            }
            console.log(`${localTempFilePath} is deleted`)
        })
    }

    async delete(id, originalFilename) {
        console.log('===delete in image adapter===')
        let imageList = []

        let name = originalFilename.split('.')[0]
        let ext = originalFilename.split('.')[1]
        const gcsOriginalImgDir = `${this.gcsDir}${id}.${ext}`
        imageList.push(gcsOriginalImgDir)

        for (const key in resizeTarget) {
            const imageDir = `${this.gcsDir}${id}-${key}.${ext}`
            imageList.push(imageDir)
        }

        imageList.forEach(async (gcsImageDir) => {
            await this.bucket.file(`${gcsImageDir}`).delete()
            console.log(`gs://${gcsImageDir} deleted.`)
        })
        // console.log(`gs://${this.gcsDir}${oldImageFolderName} deleted.`)
    }

    async getMeta(path) {
        const [meta] = await this.bucket.file(path).getMetadata() //this bucket is not a function
        return meta
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }
}

module.exports = { ImageAdapter }
