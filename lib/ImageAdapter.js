const { GCSAdapter } = require('./GCSAdapter.js')
const im = require('imagemagick-stream')
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
    async save({ stream, filename, mimetype, encoding, id }) {
        console.log('======ImageAdapter save======')
        const nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
        const baseName = path.basename(filename)
        let _meta = {}
        let ext = baseName.split('.')[1]
        stream.pipe(fs.createWriteStream(`./${id}_local_tmp`))
        var url = {}
        //Save to GCS
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${nowtime}-${id}-${key}.${ext}`

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
        console.log('---sync_save---')
        const nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
        let ext = origFilename.split('.')[1]
        let _meta = {}
        //stream.pipe(fs.createWriteStream(`./${id}_local_tmp`)) //不能pipe?
        var url = {}
        //Save to GCS
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${nowtime}-${id}-${key}.${ext}`

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
            console.log('===sync_save error===')
            console.log(err)
        }
        _meta.url = url

        return _meta
    }

    saveGCS(resized_filename, stream, key) {
        // console.log('---saveGCS---')
        // const file = this.bucket.file(`${this.gcsDir}${resized_filename}`) //get the upload path
        // //const write = file.createWriteStream(this.getOptions(resized_filename));
        // const write = file.createWriteStream()
        // stream
        //     .pipe(
        //         im()
        //             .set('density', 72)
        //             .resize(
        //                 `${resizeTarget[key].width}x${resizeTarget[key].height}`
        //             )
        //             .quality(85)
        //     )
        //     .pipe(write) //resize and upload
    }

    saveOriginalSizedImage(nowtime, id, ext, stream, url) {
        const originalSize = this.bucket.file(
            `${this.gcsDir}${nowtime}-${id}.${ext}`
        )
        const originalWrite = originalSize.createWriteStream(this.getOptions())
        stream.pipe(originalWrite)
        url.urlOriginal = `${imgUrlBase}${this.gcsDir}${nowtime}-${id}.${ext}`
    }

    delete(file) {}

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
