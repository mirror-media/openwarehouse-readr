const { createApolloFetch } = require('apollo-fetch')
const fetch = createApolloFetch({
    uri: 'http://localhost:3000/admin/api',
})
const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')

const validateIfPostIsPublished = async (
    resolvedData,
    existingItem,
    addValidationError
) => {
    const currentPostId = returnExistedKeyValueBetweenObjects(
        'choice',
        resolvedData,
        existingItem
    )
    console.log(currentPostId)
    if (currentPostId) {
        await fetch({
            query: generateGqlQueryByCMS(),
            variables: { id: currentPostId },
        })
            .then((result) => {
                // const { data, errors, extensions } = result
                // GraphQL errors and extensions are optional
                const fetchedPost = result.data.Post

                if (fetchedPost.state !== 'published') {
                    addValidationError(
                        '新增至編輯精選的文章，狀態必須為Published'
                    )
                }
            })
            .catch((error) => {
                // respond to a network error
            })
    }
}

function generateGqlQueryByCMS() {
    return `
    query fetchPost($id: ID!) {
        Post(where: {id: $id}) {
        id
        name
        state
      }
    }
    `
}

module.exports = { validateIfPostIsPublished }
