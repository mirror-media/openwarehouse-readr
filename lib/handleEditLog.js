const filter = require('lodash/filter')
const _ = { filter }

const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})

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

    const parsedEditData = destructureAndParseEditedData(editedData)
    const draftEditorState = parsedEditData.content
    // delete parsedEditData.content

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
    // fetch origin data(Todo)
    const variables = {
        name: arg.authedItem.name,
        operation: arg.operation,
        postId: postId,
        changedList: JSON.stringify(parsedEditData),
    }
    //   upload EditLog
    console.log('-----variables-----')
    console.log(variables)

    fetch({
        query: CREATE_LOG_LIST,
        variables: variables,
    })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
}

function destructureAndParseEditedData(editData) {
    // 1: get keys except for id and updatedAt
    delete editData.id
    delete editData.updatedAt

    return editData
    // return editData
}

module.exports = { handleEditLog }
