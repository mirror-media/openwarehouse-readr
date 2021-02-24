const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')
const Jimp = require('jimp')

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

    await image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5,
    })

    await image.rotate(180)

    await image.writeAsync(`./public/images/${fullFileName}`)
}

module.exports = { addWatermarkIfNeeded }
