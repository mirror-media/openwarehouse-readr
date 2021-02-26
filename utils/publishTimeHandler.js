const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')

const validateIfPostNeedPublishTime = async (
    existingItem,
    resolvedData,
    addValidationError
) => {
    const currentPostState = returnExistedKeyValueBetweenObjects(
        'state',
        resolvedData,
        existingItem
    )
    const currentPublishTime = returnExistedKeyValueBetweenObjects(
        'publishTime',
        resolvedData,
        existingItem
    )
    const needPublishTime =
        currentPostState === 'published' || currentPostState === 'scheduled'
    const noPublishTime =
        currentPublishTime === null || typeof currentPublishTime === 'undefined'

    if (needPublishTime && noPublishTime) {
        addValidationError(
            '若狀態為「Published」、「Scheduled」,則發佈時間不能空白'
        )
    }
}

const validateIfPublishTimeIsFutureTime = async (
    existingItem,
    resolvedData,
    addValidationError
) => {
    // validate post state only when post state updated( which means resolvedData has state key)
    const updatedPostState = resolvedData?.state

    const postPublishTime = returnExistedKeyValueBetweenObjects(
        'publishTime',
        resolvedData,
        existingItem
    )

    const needValidatePublishTime =
        updatedPostState === 'published' || updatedPostState === 'scheduled'

    if (needValidatePublishTime) {
        const nowTime = new Date(Date.now())
        const currentPublishTime = new Date(postPublishTime)

        //newDateTime field's "now" button active only within 60s
        const publishTimeIsFutureTime = currentPublishTime - nowTime >= -3600000

        if (!publishTimeIsFutureTime) {
            addValidationError('發佈時間不能是過去的時間')
        }
    }
}

module.exports = {
    validateIfPostNeedPublishTime,
    validateIfPublishTimeIsFutureTime,
}
