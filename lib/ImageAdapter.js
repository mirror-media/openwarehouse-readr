const { GCSAdapter } = require('./GCSAdapter.js')
// const im = require('imagemagick-stream') // not supported
const sharp = require('sharp')
const Jimp = require('jimp')

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const {
    storage: { imgUrlBase },
} = require('../configs/config')
const resizeTarget = {
    desktop: { height: 713, width: 1268 },
    tablet: { height: 675, width: 1200 },
    mobile: { height: 450, width: 800 },
    tiny: { height: 84, width: 150 },
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
        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            try {
                const splitNameArray = origFilename.split('.')
                const ext = splitNameArray[splitNameArray.length - 1]

                // (image name only if needed)
                // splitNameArray.pop()
                // const name = splitNameArray.join('.')

                let _meta = {}
                var url = {}

                await this.saveVariusSizeImage(id, ext, stream, url)
                await this.saveOriginalSizedImage(id, ext, stream, url)

                // after update to gcs, delete local image
                this.deleteLocalTempFile(id, origFilename)

                _meta.url = url
                console.log('===finish sync_save===')
                resolve(_meta)
            } catch (err) {
                console.log('error in sync_save')
                reject(err)
            }
        })
    }

    saveOriginalSizedImage(id, ext, stream, url) {
        return new Promise(async (resolve, reject) => {
            try {
                const filename = `${id}.${ext}`

                //Save image to gcs
                // await this.saveToGCS(stream, filename, null)
                await this.saveOriginalToGCS(stream, filename, null)
                // create url which link to gcs
                this.createUrlToUrlObject(null, url, filename)
                resolve(true)
            } catch (err) {
                console.log('error in saveOriginalSizedImage', err)
                reject(err)
            }
        })
    }

    // determine which size is needed,
    // then start uploading and create related url
    saveVariusSizeImage(id, ext, stream, url) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const resizeKey in resizeTarget) {
                    const resized_filename = `${id}-${resizeKey}.${ext}`

                    //Save image to gcs
                    this.saveToGCS(stream, resized_filename, resizeKey)
                    // Create url which link to gcs
                    this.createUrlToUrlObject(resizeKey, url, resized_filename)
                }
                resolve(true)
            } catch (err) {
                console.log(
                    `error in saveVariusSizeImage : ${id}-${resizeKey}.${ext}`,
                    err
                )
                reject(error)
            }
        })
    }

    createUrlToUrlObject(key, url, filename) {
        if (key) {
            switch (key) {
                case 'tiny':
                    url.urlTinySized = `${imgUrlBase}${this.gcsDir}${filename}`
                    break
                case 'mobile':
                    url.urlMobileSized = `${imgUrlBase}${this.gcsDir}${filename}`
                    break
                case 'tablet':
                    url.urlTabletSized = `${imgUrlBase}${this.gcsDir}${filename}`
                    break
                case 'desktop':
                    url.urlDesktopSized = `${imgUrlBase}${this.gcsDir}${filename}`
                    break
            }
        } else {
            url.urlOriginal = `${imgUrlBase}${this.gcsDir}${filename}`
        }
    }

    /*
    When using stream.pipe within promise many times, 
    for some reason 2nd and rest of streams will break.
    However, original image uploading must be asynchronous
    (or image snapshot will break after update/create first time),
    (Todo)
    */
    saveOriginalToGCS(stream, filename, resizeKey) {
        return new Promise((resolve, reject) => {
            const gcsUploadPath = `${this.gcsDir}${filename}`
            const file = this.bucket.file(gcsUploadPath) //get the upload path
            const write = file.createWriteStream()

            if (!resizeKey) {
                // when resizeKey is null, means it's now handling original size image
                stream.pipe(write)

                write
                    .on('finish', () => {
                        console.log(`${filename} has been uploaded to gcs`)
                        resolve(true)
                    })
                    .on('error', (err) => {
                        console.log(
                            `something was wrong when uploading ${filename}`,
                            err
                        )

                        reject(err)
                    }) //resize and upload //resize and upload
            } else {
                reject()
            }
        })
    }

    saveToGCS(stream, filename, resizeKey) {
        const gcsUploadPath = `${this.gcsDir}${filename}`
        const file = this.bucket.file(gcsUploadPath) //get the upload path
        const write = file.createWriteStream()

        if (!resizeKey) {
            // when resizeKey is null, means it's now handling original size image
            stream.pipe(write)
        } else {
            // when resizeKey has value(tiny, mobile...etc),
            // means it's now handling various size image
            const resize = sharp().resize(
                resizeTarget[resizeKey].width,
                resizeTarget[resizeKey].height,
                {
                    fit: 'inside',
                }
            )

            stream.pipe(resize).pipe(write)
        }

        write
            .on('finish', () => {
                console.log(`${filename} has been uploaded to gcs`)
            })
            .on('error', (err) => {
                console.log(
                    `something was wrong when uploading ${filename}`,
                    err
                )
            }) //resize and upload //resize and upload
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

        const splitNameArray = originalFilename.split('.')
        const ext = splitNameArray[splitNameArray.length - 1]

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
