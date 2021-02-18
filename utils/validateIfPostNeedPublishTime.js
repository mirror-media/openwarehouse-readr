const validateIfPostNeedPublishTime = (existingItem, resolvedData, addValidationError) => {
    let currentPostState = resolvedData.state || existingItem.state
    let currentPublishTime = resolvedData.publishTime || resolvedData.publishTime

    const needPublishTime = currentPostState === 'published' || currentPostState === 'scheduled'
    const noPublishTime = currentPublishTime === null || typeof currentPublishTime === 'undefined'

    if (needPublishTime && noPublishTime) {
        addValidationError('若狀態為「Published」、「Scheduled」,則發佈時間不能空白')
    }
}

module.exports = { validateIfPostNeedPublishTime }
