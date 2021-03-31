const probe = require('probe-image-size')
const sharp = require('sharp')
const fs = require('fs')

const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

function getUrlImageDimentions(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await probe(url, { rejectUnauthorized: false })
            resolve({ width: result.width, height: result.height })
        } catch (err) {
            reject(err)
        }
    })
}

function getOriginalImageDimentionInLocal(originalFileName) {
    const stream = fs.createReadStream(`./public/images/${originalFileName}`)

    return new Promise((resolve, reject) => {
        const metaReader = sharp()
        metaReader
            .metadata()
            .then((info) => {
                resolve({
                    width: info.width,
                    height: info.height,
                })
            })
            .catch((err) => {
                console.log('err', err)
                reject({
                    width: 'unknown',
                    height: 'unknown',
                })
            })

        stream.pipe(metaReader)
    })
}

module.exports = {
    getUrlImageDimentions,
    getOriginalImageDimentionInLocal,
}
