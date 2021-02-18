/* 
Every DraftEditor field has 3 corresponding data:
editorState,html and api data
three of them are packaged in content (in Controller)

before save post,
need to get html and api data in content
and put them to resolvedData
*/

/*
resolveData:
    edited fields in list (created data, updated new data)
    it's null only when there's no updated data

existingItem:
    when created, existingItem is null,
    when updated, it represent the old data
*/

const parseResolvedData = (existingItem, resolvedData) => {
    // get every draft field's storedEditorContent
    const fieldsArray = ['summary', 'brief', 'content']

    try {
        /* 
        because we use A.content || B.content below
        (content can be undefined, but A,B can't)
        so need to make sure A,B is NOT undefined
         */
        const existingItemRef = existingItem ? existingItem : resolvedData

        // [summary(obj), brief(obj), content(obj)]
        const storedEditorContentsArray = fieldsArray.map((field) => {
            return resolvedData[field] || existingItemRef[field]
        })

        storedEditorContentsArray.forEach((editorContent, index) => {
            // for now, only handle content field(Todo)
            // if (fieldsArray[index] !== 'content') return

            let currentEditorContentValve = _getEditorContentValue(editorContent)
            _feedFieldValueToResolvedData(index, currentEditorContentValve)
        })
    } catch (err) {
        console.log(err)
        console.log('EXISTING ITEM')
        console.log(existingItem)
        console.log('RESOLVED DATA')
        console.log(resolvedData)
    }

    function _getEditorContentValue(editorContent) {
        if (!editorContent) {
            // if it's undefined(create from api), return initial data
            return {
                html: '',
                apiData: '',
            }
        } else {
            // if has editorContent, JSON it.
            return JSON.parse(editorContent)
        }
    }

    function _feedFieldValueToResolvedData(currentFieldIndex, currentEditorContent) {
        // storedEditorContent is formated to 3 part:
        // draftState itself, contentHTML, and contentApidata
        // destructure them and put it into resolvedData's key
        const { html, apiData } = currentEditorContent

        // ex:brief
        // resolvedData.brief = currentEditorContent
        // resolvedData.briefHtml = html
        // resolvedData.cbriefApiData = JSON.stringify(apiData)
        const currentField = fieldsArray[currentFieldIndex]
        resolvedData[`${currentField}`] = JSON.stringify(currentEditorContent)
        resolvedData[`${currentField}Html`] = html
        resolvedData[`${currentField}ApiData`] = JSON.stringify(apiData)
    }
}

module.exports = { parseResolvedData }
