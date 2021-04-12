const { getNewFilename, getFileDetail } = require('./fileDetailHandler')
const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')

const feedNewVideoData = (resolvedData) => {
    return new Promise((resolve, reject) => {
        try {
            resolvedData.file.filename = getNewFilename(resolvedData)
            resolvedData.meta = resolvedData.file._meta
            resolvedData.url = resolvedData.file._meta.url
            resolvedData.duration = resolvedData.file._meta.duration

            resolve()
        } catch (err) {
            reject()
        }
    })
}

const deleteOldVideoFileInGCS = async (existingItem, fileAdapter) => {
    if (existingItem.file) {
        await fileAdapter.delete(
            existingItem.file.id,
            existingItem.file.originalFilename
        )
    }
}

const validateWhichUrlShouldCMSChoose = async (
    existingItem,
    resolvedData,
    addValidationError
) => {
    const youtubeUrl = returnExistedKeyValueBetweenObjects(
        'youtubeUrl',
        resolvedData,
        existingItem
    )
    const file = returnExistedKeyValueBetweenObjects(
        'file',
        resolvedData,
        existingItem
    )

    if (youtubeUrl && file) {
        addValidationError(
            '「Youtube網址」與「檔案」只能選擇一個作為影片來源，清除其中一個'
        )
    }

    if (!youtubeUrl && !file) {
        addValidationError(
            '沒有影片來源，請在「Youtube網址」與「檔案」兩者中選擇一個作為影片來源'
        )
    }
}

const assignYoutubeUrl = (existingItem, resolvedData) => {
    const youtubeUrl = returnExistedKeyValueBetweenObjects(
        'youtubeUrl',
        resolvedData,
        existingItem
    )

    return youtubeUrl
}

module.exports = {
    deleteOldVideoFileInGCS,
    feedNewVideoData,
    validateWhichUrlShouldCMSChoose,
    assignYoutubeUrl,
}
