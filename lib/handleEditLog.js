const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})

const handleEditLog = async (arg) => {
    let operation
    let postId
    let changedList
    switch (arg.operation) {
        case 'create':
            operation = 'create'
            postId = arg.createdItem.id
            changedList = JSON.stringify(arg.createdItem)

            break
        case 'update':
            operation = 'update'
            postId = arg.changedItem.id
            changedList = JSON.stringify(arg.changedItem)

            break
        case 'delete':
            operation = 'delete'
            postId = arg.deletedItem.id
            changedList = JSON.stringify(arg.deletedItem)

            break

        default:
            break
    }
    const nowUnixTimestamp = Date.now()
    const nowISO8601 = new Date(nowUnixTimestamp)

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
        changedList: changedList,
    }
    //   upload EditLog
    console.log('creating EditLog!!!!(Todo)')
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

module.exports = { handleEditLog }
