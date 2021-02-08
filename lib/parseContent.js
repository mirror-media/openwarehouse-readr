// Every DraftEditor field has 3 corresponding data:
// editorState,html and api data
// three of them are packaged in content (in Controller)

// before save post,
// we need to get html and api data in content
// and put them to resolvedData
const parseResolvedData = (existingItem, resolvedData) => {
    // resolveData:
    // all fields in list (created data, updated new data)
    // it's null only when no updated data

    // existingItem:
    // when created, existingItem is null,
    // when updated, it represent the old data

    try {
        // we always manipulate resolvedData
        // use existingItem only when there's no updated fields,
        // (that means resolvedDate === null)
        let waitingForParse = resolvedData || existingItem

        let content
        if (waitingForParse.content) {
            content = JSON.parse(waitingForParse.content)
        } else {
            content = {
                html: '',
                apiData: '',
            }
        }

        // in HTML field's control section, content is format to 3 part:
        // draftState itself, contentHTML, and contentApidata
        // take out them and put it into resolvedDate's key
        resolvedData.contentHtml = content.html
        resolvedData.contentApiData = JSON.stringify(content.apiData)
        delete content['html']
        delete content['apiData']
        resolvedData.content = content
    } catch (err) {
        console.log(err)
        console.log('EXISTING ITEM')
        console.log(existingItem)
        console.log('RESOLVED DATA')
        console.log(resolvedData)
    }
}

module.exports = { parseResolvedData }
