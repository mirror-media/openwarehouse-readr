const filter = require('lodash/filter')
const _ = { filter }

const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})

const CREATE_LOG_LIST = `
mutation CreateLogList(
  $name: String!
  $operation:String!
  $postId: String!
  $changedList: String!
  ) {
  createEditLog(
    data: {
      name: $name
      operation:$operation
      postId: $postId
      changedList: $changedList
    }
  ) {
    name
  }
}
`

const handleEditLog = async (arg) => {
    let operation
    let postId
    let editedData
    switch (arg.operation) {
        case 'create':
            operation = 'create'
            postId = arg.createdItem.id
            editedData = arg.createdItem

            break
        case 'update':
            operation = 'update'
            postId = arg.changedItem.id
            editedData = arg.changedItem

            break
        case 'delete':
            operation = 'delete'
            postId = arg.deletedItem.id
            editedData = arg.deletedItem

            break

        default:
            break
    }

    editedData = removeUnusedKey(editedData)
    // editedData = removeHtmlAndApiData(editedData)
    const variables = generateVariables(operation, arg, postId, editedData)

    console.log(variables)
    fetch({
        query: CREATE_LOG_LIST,
        variables: variables,
    })
        .then((res) => {
            console.log('Editlog emit success\n', res)
        })
        .catch((err) => {
            console.log('Editlog emit fail\n', err)
        })
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
        if (editData[item]) {
            delete editData[item]
        }
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

function generateVariables(operation, arg, postId, editedData) {
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
        }
    })

    // put rest of fields into variables.changeList
    variables.changedList = JSON.stringify(editedData)

    return variables
}

module.exports = { handleEditLog }
