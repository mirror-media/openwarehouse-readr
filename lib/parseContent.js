const parseContent = (existingItem, resolvedData) => {
    // resolveData:
    // all fields in list (created data, updated new data)

    // existingItem:
    // when created, existingItem is null,
    // when updated, it represent the old data

    try {
        // take the updated data(if it's update condition),or original data
        const waitingForParse = resolvedData.content || existingItem.content
        const content = JSON.parse(waitingForParse)

        // in HTML field's control section, content is format to 3 part:
        // draftState itself, contentHTML, and contentApidata
        // take out them and put it into resolvedDate's key
        resolvedData.contentHtml = content.html
        resolvedData.contentApiData = JSON.stringify(content.apiData)
        delete content['html']
        delete content['apiData']
        resolvedData.content = content
        return { existingItem, resolvedData }
    } catch (err) {
        console.log(err)
        console.log('EXISTING ITEM')
        console.log(existingItem)
        console.log('RESOLVED DATA')
        console.log(resolvedData)
    }
}

module.exports = { parseContent }
