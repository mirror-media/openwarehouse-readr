const { Storage } = require('@google-cloud/storage')
const moment = require('moment')
const path = require('path')
const gcskeyfile = '../configs/gcskeyfile.json'
const fs = require('fs')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const { getVideoDurationInSeconds } = require('get-video-duration')
const { resolve } = require('path')
const {
    storage: { bucket },
} = require('../configs/config')

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports.GCSAdapter = class {
    constructor(gcsDir, gcskeyfilePath = gcskeyfile) {
        gcskeyfilePath = path.resolve(gcskeyfile)
        console.log('THE gcskeyfile Path:', gcskeyfilePath)
        if (!gcskeyfilePath) {
            throw new Error(
                'GCSAdapter needs you specifies GOOGLE_APPLICATION_CREDENTIALS, should be a string path'
            )
        }
        process.env.GOOGLE_APPLICATION_CREDENTIALS = gcskeyfilePath
        this.storage = new Storage()
        this.bucket = this.storage.bucket(bucket)
        this.gcsDir = gcsDir
    }

    getFilename({ id, originalFilename }) {
        return `${id}-${originalFilename}`
    }

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
    async save({ stream, filename, mimetype, encoding, id }) {
        let _meta = {}

        var { file, baseName, uploadedName } = this.prepareUpload(filename, id) //filename saved on GCS
        stream = await this.getDuration(id, stream, mimetype, _meta)

        try {
            await this.uploadFile(stream, file, baseName)
            var mimeInfo = await file.getMetadata()
        } catch (err) {
            console.log(err)
        }

        _meta.mimeInfo = mimeInfo
        _meta.url = this.PublicUrl(uploadedName)
        return { id, filename, _meta }
    }

    async getDuration(id, stream, mimetype, _meta) {
        let newLocal = `./${id}_tmp`
        let write = fs.createWriteStream(newLocal)

        await new Promise((resolve, reject) => {
            stream.pipe(write).on('finish', async () => {
                if (mimetype.match('^video/*')) {
                    var duration = await getVideoDurationInSeconds(newLocal)
                    resolve(duration)
                } else if (mimetype.match('^audio/')) {
                    var duration = await getAudioDurationInSeconds(newLocal)
                    resolve(duration)
                }
                console.log('DURATION: ', duration)
                _meta.duration = duration
            })
        })

        stream = fs.createReadStream(newLocal)
        fs.unlink(newLocal, function (err) {
            if (err) {
                throw err
            }
            console.log(`${newLocal} is deleted`)
        })
        return stream
    }

    prepareUpload(filename, id) {
        const baseName = path.basename(filename)
        const nowtime = moment(new Date()).format('YYYYMMDDhhmmss')
        let ext = baseName.split('.')[1]
        let uploadedName = `${nowtime}-${id}.${ext}`
        let file = this.bucket.file(`${this.gcsDir}${uploadedName}`) //filename saved on GCS
        return { file, baseName, uploadedName }
    }

    async uploadFile(stream, file, baseName) {
        return new Promise((resolve, reject) => {
            const write = file.createWriteStream(this.getOptions(baseName))
            stream.pipe(write)
            write
                .on('error', function (err) {
                    console.log(err)
                    reject(err)
                })
                .on('finish', function () {
                    file.makePublic(function (err, apiResponse) {
                        if (err) {
                            return reject(err)
                        }
                        resolve(apiResponse)
                    })
                })
        })
    }

    getOptions(filename) {
        // let destination = `${this.gcsDir}${filename}`
        let options = {
            gzip: true,
            // destination: destination,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
            //public: true
        }
        return options
    }

    async delete(filename) {
        await this.bucket.file(filename).delete()

        console.log(`gs://${this.gcsDir}${filename} deleted.`)
    }

    async makePublic(filename) {
        // Makes the file public

        //await this.bucket.file(`${this.gcsDir}{filename}`).makePublic()

        console.log(`gs://${filename} is now public.`)
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${storage.bucket}/${this.gcsDir}${filename}`
        return s
    }
}
