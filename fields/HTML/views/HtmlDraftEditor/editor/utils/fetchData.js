import { createApolloFetch } from 'apollo-fetch'
import gql from 'graphql-tag'

const fetch = createApolloFetch({
    uri: '/admin/api',
})

function generateSelectString(columns) {
    return columns.join('\n')
}

function generateWhereString(columns) {
    const exclusion = ['duration']
    return `{OR: [${columns
        .filter((column) => !exclusion.includes(column))
        .map((column) => `{${column}_contains: $search}`)
        .join()}]}`
}

export const fetchDataWithGql = async (
    { list, columns, maxItemsPerPage },
    search,
    page,
    setCallBack
) => {
    const selectString = generateSelectString(columns)
    const whereString = generateWhereString(columns)

    const { data } = await fetch({
        query: `
        query fetch${list}s($search: String!, $skip: Int!, $first: Int!) {
            all${list}s(where: ${whereString}, skip: $skip, first: $first, sortBy: id_DESC) {
              id
              ${selectString}
            }
        }`,
        variables: {
            search: search,
            skip: (page - 1) * maxItemsPerPage,
            first: maxItemsPerPage,
        },
    })

    // setCallBack(data[`all${list}s`])
    return data[`all${list}s`]
}

export const fetchDataCountWithGql = async (
    { list, columns, maxItemsPerPage },
    search
) => {
    const whereString = generateWhereString(columns)
    const {
        data: {
            [`_all${list}sMeta`]: { count },
        },
    } = await fetch({
        query: `
            query($search: String!) {
                _all${list}sMeta(where: ${whereString}) {
                  count
                }
            }`,
        variables: {
            search: search,
        },
    })

    return count
}

// export const setPages = async ({ list, columns, maxItemsPerPage }, search) => {
//     console.log('setPages')
//     const whereString = generateWhereString(columns)
//     const {
//         data: {
//             [`_all${list}sMeta`]: { count },
//         },
//     } = await fetch({
//         query: `
//             query($search: String!) {
//                 _all${list}sMeta(where: ${whereString}) {
//                   count
//                 }
//             }`,
//         variables: {
//             search: search,
//         },
//     })

//     return Math.ceil(count / maxItemsPerPage)
// }
