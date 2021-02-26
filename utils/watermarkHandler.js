const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')
const Jimp = require('jimp')
const { app } = require('../configs/config.js')

const addWatermarkIfNeeded = async (resolvedData, existingItem) => {
    const isNeedWatermark = checkIfNeedWatermark(resolvedData, existingItem)

    if (isNeedWatermark) {
        let fullFileName = resolvedData.file.filename
        await addWatermark(fullFileName)
    }
}

function checkIfNeedWatermark(resolvedData, existingItem) {
    return returnExistedKeyValueBetweenObjects(
        'needWatermark',
        resolvedData,
        existingItem
    )
}

async function addWatermark(fullFileName) {
    console.log(`${fullFileName} is ready to add watermark`)

    const watermark = await Jimp.read(
        `./public/images/watermark.png`
    ).then((image) => image.rotate(180))
    const image = await Jimp.read(
        `./public/images/${fullFileName}`
    ).then((image) => image.rotate(180))
    const watermarkOpacity = app.project === 'mirror-tv' ? 1 : 0.5

    await image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: watermarkOpacity,
    })

    await image.rotate(180)

    await image.writeAsync(`./public/images/${fullFileName}`)
}

module.exports = { addWatermarkIfNeeded }
