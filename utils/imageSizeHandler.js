const probe = require('probe-image-size')
const variusSizeKeyList = [
    'urlOriginal',
    'urlDesktopSized',
    'urlMobileSized',
    'urlTabletSized',
    'urlTinySized',
]
const resizeTarget = {
    desktop: { height: 713, width: 1268 },
    tablet: { height: 675, width: 1200 },
    mobile: { height: 450, width: 800 },
    tiny: { height: 84, width: 150 },
}

const generateImageSizeList = (resolvedData, existingItem) => {
    let variusSizeUrlData = {}

    if (existingItem && !existingItem.variusSizeUrlData) {
        // if existingItem is NOT null
        // means user didn't do something with media data
        // need to generate new sizeData for old image
        variusSizeUrlData = generateUrlObject(existingItem)
    } else {
        // in THIS FUNCTION (important, the following discription isn't global keystone behavior)
        // if existingItem is null
        // means it now creating/updating image
        // just manipulate with resoledData
        variusSizeUrlData = generateUrlObject(resolvedData)
    }

    return new Promise(async (resolve, reject) => {
        try {
            const originalSizedUrl = variusSizeUrlData.urlOriginal
            const originalImageDimentions = await getUrlImageDimentions(
                originalSizedUrl
            )
            const { width, height } = originalImageDimentions

            const ratio = width / height
            const fixRatio = 1.778
            let variusImageSizeList = {}

            if (ratio > fixRatio) {
                variusImageSizeList = {
                    desktop: {
                        width: 1268,
                        height: getHeightByWidthAndRatio(1268, ratio),
                    },
                    tablet: {
                        width: 1200,
                        height: getHeightByWidthAndRatio(1200, ratio),
                    },
                    mobile: {
                        width: 800,
                        height: getHeightByWidthAndRatio(800, ratio),
                    },
                    tiny: {
                        width: 150,
                        height: getHeightByWidthAndRatio(150, ratio),
                    },
                }
            } else {
                variusImageSizeList = {
                    desktop: {
                        width: getWidthByHeightAndRatio(713, ratio),
                        height: 713,
                    },
                    tablet: {
                        width: getWidthByHeightAndRatio(675, ratio),
                        height: 675,
                    },
                    mobile: {
                        width: getWidthByHeightAndRatio(450, ratio),
                        height: 450,
                    },
                    tiny: {
                        width: getWidthByHeightAndRatio(84, ratio),
                        height: 84,
                    },
                }
            }

            resolve(JSON.stringify(variusImageSizeList))
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

async function getUrlImageDimentions(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await probe(url, { rejectUnauthorized: false })
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
}

function generateUrlObject(target) {
    return {
        urlOriginal: target.urlOriginal,
        urlDesktopSized: target.urlDesktopSized,
        urlMobileSized: target.urlMobileSized,
        urlTabletSized: target.urlTabletSized,
        urlTinySized: target.urlTinySized,
    }
}

function getHeightByWidthAndRatio(width, ratio) {
    const height = Math.round(width / ratio)
    return height
}

function getWidthByHeightAndRatio(height, ratio) {
    const width = Math.round(height * ratio)
    return width
}

module.exports = { generateImageSizeList }
