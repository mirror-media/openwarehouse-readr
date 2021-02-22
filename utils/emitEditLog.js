const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})
const { app } = require('../configs/config.js')

const emitEditLog = async (arg) => {
    let { operation, postId, editedData } = returnPostEditingDetails(arg)

    editedData = removeUnusedKey(editedData)
    editedData = removeHtmlAndApiData(editedData)

    const variables = generateVariablesForGql(
        operation,
        arg,
        postId,
        editedData
    )
    fetch({
        query: generateGqlQueryByCMS(),
        variables: variables,
    })
        .then((result) => {
            // const { data, errors, extensions } = result;
            // GraphQL errors and extensions are optional
            console.log('===Editlog emitted===\n')
        })
        .catch((error) => {
            // respond to a network error
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

function generateGqlQueryByCMS() {
    switch (app.project) {
        case 'readr':
            return `
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

        case 'mirrormedia':
            ;`
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `

        case 'mirror-tv':
            return `
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `
        default:
            return `
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `
    }
}

module.exports = { emitEditLog }
