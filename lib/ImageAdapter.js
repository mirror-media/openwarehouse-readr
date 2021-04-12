const { GCSAdapter } = require('./GCSAdapter.js')
// const im = require('imagemagick-stream') // not supported
const sharp = require('sharp')
const Jimp = require('jimp')

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const { storage } = require('../configs/config')
const GCSUrlBase = storage.imgUrlBase
const imageUrlBase = 'assets/images/'
const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}
const {
    getOriginalImageDimentionInLocal,
    getUrlImageDimentions,
} = require('../utils/imageSizeHandler')

class ImageAdapter extends GCSAdapter {
    constructor(...args) {
        super(...args)
        this.apiData = {
            url: '',
            original: {
                url: '',
                width: '',
                height: '',
            },
            desktop: {
                url: '',
                width: '',
                height: '',
            },
            tablet: {
                url: '',
                width: '',
                height: '',
            },
            mobile: {
                url: '',
                width: '',
                height: '',
            },
            tiny: {
                url: '',
                width: '',
                height: '',
            },
        }
    }

    // No use
    async save({ stream, filename, mimetype, encoding, id }) {}

    sync_save() {
        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            let _meta = {}
            try {
                await this.saveOriginalImage(this.newFileName)
                await this.saveVariousSizeImage(this.newFileName)
                console.log('all image uploaded')

                await this.generateImageApiData(this.newFileName)
                // after update to gcs, delete local image
                this.deleteLocalTempFile(this.originalFileName)

                _meta.apiData = this.apiData
                resolve(_meta)
            } catch (err) {
                console.log('error in sync_save', err)
                reject(err)
            }
        })
    }

    saveOriginalImage(newFileName) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.resizeImageThenSaveToGCS(newFileName, null)
                // this.createUrlToApiData(newFileName, null)

                resolve(true)
            } catch (err) {
                console.log(err)
                reject(error)
            }
        })
    }

    async saveVariousSizeImage(newFileName) {
        const splitNameArray = newFileName.split('.')
        const id = this.id
        const ext = splitNameArray[splitNameArray.length - 1]

        // need to get original iamge's dimention
        // if original image is smaller than resize frame, then dont resize
        const { width, height } = await getOriginalImageDimentionInLocal(
            this.originalFileName
        )

        return new Promise(async (resolve, reject) => {
            try {
                for (const resizeKey in resizeTarget) {
                    const resized_filename = `${id}-${resizeKey}.${ext}`

                    if (
                        width < resizeTarget[resizeKey].width &&
                        height < resizeTarget[resizeKey].height
                    ) {
                        // no need to resize, upload original size (with new name, by the way)
                        await this.resizeImageThenSaveToGCS(
                            resized_filename,
                            null
                        )
                    } else {
                        // resize image
                        await this.resizeImageThenSaveToGCS(
                            resized_filename,
                            resizeKey
                        )
                    }

                    // this.createUrlToApiData(resized_filename, resizeKey)
                }
                resolve(true)
            } catch (err) {
                console.log(err)
                reject(error)
            }
        })
    }

    resizeImageThenSaveToGCS(newFileName, resizeKey) {
        const stream = fs.createReadStream(
            `./public/images/${this.originalFileName}`
        )

        return new Promise(async (resolve, reject) => {
            const gcsUploadPath = `${imageUrlBase}${newFileName}`
            const file = this.bucket.file(gcsUploadPath) //get the upload path
            const write = file
                .createWriteStream()
                .on('finish', (data) => {
                    resolve()
                })
                .on('error', (err) => {
                    reject(err)
                })

            if (resizeKey) {
                // save various size image
                const resize = sharp()
                resize.resize(
                    resizeTarget[resizeKey].width,
                    resizeTarget[resizeKey].height,
                    {
                        fit: 'inside',
                    }
                )

                stream.pipe(resize).pipe(write)
            } else {
                // save original image
                stream.pipe(write)
            }
        })
    }

    deleteLocalTempFile(origFilename) {
        const localTempFilePath = `./public/images/${origFilename}`
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

        const gcsOriginalImgDir = `${imageUrlBase}${id}.${ext}`
        imageList.push(gcsOriginalImgDir)

        for (const key in resizeTarget) {
            const imageDir = `${imageUrlBase}${id}-${key}.${ext}`
            imageList.push(imageDir)
        }

        try {
            imageList.forEach(async (gcsImageDir) => {
                await this.bucket.file(`${gcsImageDir}`).delete()
                console.log(`gs://${gcsImageDir} deleted.`)
            })
        } catch (err) {
            console.log(err)
        }
        // console.log(`gs://${imageUrlBase}${oldImageFolderName} deleted.`)
    }

    async getMeta(path) {
        const [meta] = await this.bucket.file(path).getMetadata() //this bucket is not a function
        return meta
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }

    metaHandler() {
        // // console.log('variousSizeImageNameList', this.variousSizeImageNameList)
        // this.variousSizeImageNameList.forEach(async (image) => {
        //     const gcsUploadPath = `${imageUrlBase}${image}`
        //     const meta = this.getMeta(gcsUploadPath)
        // })
    }

    generateImageApiData(newFileName) {
        return new Promise(async (resolve, reject) => {
            try {
                // generate name list
                // use it to generate each size's apiData one by one
                const imageNameList = this.generateImageNameList(newFileName)
                console.log(imageNameList)

                imageNameList.forEach((imageName) => {
                    this.createUrlToApiData(imageName)
                })

                await this.fetchAllImageSizeToApiData(this.apiData)
                resolve()
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    }

    generateImageNameList(newFileName) {
        const nameList = [newFileName]
        const splitNameArray = newFileName.split('.')
        const id = splitNameArray[0]
        const ext = splitNameArray[splitNameArray.length - 1]

        for (const resizeKey in resizeTarget) {
            nameList.push(`${id}-${resizeKey}.${ext}`)
        }

        return nameList
    }

    createUrlToApiData(filename) {
        const { resizeKey } = this.generateFileNameSeperation(filename)

        if (resizeKey) {
            switch (resizeKey) {
                case 'tiny':
                    this.apiData.tiny.url = `${GCSUrlBase}${imageUrlBase}${filename}`
                    break
                case 'mobile':
                    this.apiData.mobile.url = `${GCSUrlBase}${imageUrlBase}${filename}`
                    break
                case 'tablet':
                    this.apiData.tablet.url = `${GCSUrlBase}${imageUrlBase}${filename}`
                    break
                case 'desktop':
                    this.apiData.desktop.url = `${GCSUrlBase}${imageUrlBase}${filename}`
                    break
            }
        } else {
            this.apiData.original.url = `${GCSUrlBase}${imageUrlBase}${filename}`
            this.apiData.url = `${GCSUrlBase}${imageUrlBase}${filename}`
        }
    }

    // name must be "id-size.ext" structure
    generateFileNameSeperation(newFileName) {
        const splitNameArray = newFileName.split('.')
        const ext = splitNameArray[1]
        const nameOnly = splitNameArray[0]
        const nameOnlyArray = nameOnly.split('-')

        let resizeKey = ''
        if (nameOnlyArray.length > 1) {
            resizeKey = nameOnlyArray[1]
            nameOnlyArray.pop(resizeKey)
        } else {
            resizeKey = null
        }
        const id = nameOnlyArray[0]

        return {
            id,
            resizeKey,
            ext,
        }
    }

    async fetchAllImageSizeToApiData(imageApiData) {
        return new Promise(async (resolve, reject) => {
            for (const resizeKey in imageApiData) {
                if (resizeKey === 'url') continue

                const sizeObject = imageApiData[resizeKey]
                if (!sizeObject.url) continue

                try {
                    const { width, height } = await getUrlImageDimentions(
                        sizeObject.url
                    )
                    console.log(
                        `fetched ${resizeKey}'s dimention, width:${width} height:${height}`
                    )

                    imageApiData[resizeKey].width = width
                    imageApiData[resizeKey].height = height
                } catch (err) {
                    console.log(
                        `fail to fetch image's dimention, `,
                        err.message
                    )

                    imageApiData[resizeKey].width = 0
                    imageApiData[resizeKey].height = 0
                    continue
                }
            }

            resolve()
        })
    }

    generateNewImageApiData(existingItem) {
        return new Promise(async (resolve, reject) => {
            try {
                this.apiData.url = existingItem.urlOriginal
                this.apiData.original.url = existingItem.urlOriginal
                this.apiData.desktop.url = existingItem.urlDesktopSized
                this.apiData.tablet.url = existingItem.urlTabletSized
                this.apiData.mobile.url = existingItem.urlMobileSized
                this.apiData.tiny.url = existingItem.urlTinySized
                await this.fetchAllImageSizeToApiData(this.apiData)

                resolve(this.apiData)
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = { ImageAdapter }
