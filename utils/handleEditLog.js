const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})

const CREATE_LOG_LIST = `
mutation CreateLogList(
  $name: String!
  $operation:String!
  $postId: String!
  $summary: String!
  $brief: String!
  $content: String!
  $changedList: String!
  ) {
  createEditLog(
    data: {
      name: $name
      operation:$operation
      postId: $postId
      summary: $summary
      brief: $brief
      content: $content
      changedList: $changedList
    }
  ) {
    name
  }
}
`

const handleEditLog = async (arg) => {
    let { operation, postId, editedData } = returnPostEditingDetails(arg)

    editedData = removeUnusedKey(editedData)
    editedData = removeHtmlAndApiData(editedData)

    const variables = generateVariablesForGql(operation, arg, postId, editedData)

    fetch({
        query: CREATE_LOG_LIST,
        variables: variables,
    })
        .then((res) => {
            console.log('===Editlog emitted===\n', res, '=====================\n')
        })
        .catch((err) => {
            console.log('Editlog emitted : ===\n', err, '=====================\n')
        })
}

function returnPostEditingDetails(arg) {
    switch (arg.operation) {
        case 'create':
            return {
                operation: 'create',
                postId: arg.createdItem.id,
                editedData: arg.createdItem,
            }

        case 'update':
            return {
                operation: 'update',
                postId: arg.changedItem.id,
                editedData: arg.changedItem,
            }

        case 'delete':
            return {
                operation: 'delete',
                postId: arg.deletedItem.id,
                editedData: arg.deletedItem,
            }
    }
}

function removeHtmlAndApiData(editData) {
    // 1: get keys except for id and updatedAt
    const fieldsArray = [
        'summaryHtml',
        'summaryApiData',
        'briefHtml',
        'briefApiData',
        'contentHtml',
        'contentApiData',
    ]

    fieldsArray.forEach((item) => {
        // if (editData[item]) {
        //     delete editData[item]
        // }
        delete editData[item]
    })

    return editData
}

function removeUnusedKey(editData) {
    const fieldsArray = ['createdBy', 'updatedBy', 'createdAt', 'updatedAt']

    fieldsArray.forEach((item) => {
        if (editData[item]) {
            delete editData[item]
        }
    })

    return editData
}

function generateVariablesForGql(operation, arg, postId, editedData) {
    const fieldsArray = ['summary', 'brief', 'content']

    let variables = {
        name: arg.authedItem.name,
        operation: operation,
        postId: postId,
    }

    // pull out draft editor field from editedData
    // put them to variables obj, then delete original one
    fieldsArray.forEach((draftField) => {
        if (editedData[draftField]) {
            variables[draftField] = editedData[draftField]
            delete editedData[draftField]
        } else {
            // empty draft state
            variables[draftField] = ''
        }
    })

    // put rest of fields into variables.changeList
    variables.changedList = JSON.stringify(editedData)

    return variables
}

module.exports = { handleEditLog }
