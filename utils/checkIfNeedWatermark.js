const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')

const checkIfNeedWatermark = (resolvedData, existingItem) => {
    return returnExistedKeyValueBetweenObjects(
        'needWatermark',
        resolvedData,
        existingItem
    )
}

module.exports = { checkIfNeedWatermark }
