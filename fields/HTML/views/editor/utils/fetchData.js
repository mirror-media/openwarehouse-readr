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

export const setPages = (
    { list, columns, maxItemsPerPage },
    search,
    setCallBack
) => {
    console.log('setPages')
    // ;(async () => {
    //     const whereString = generateWhereString(columns)
    //     const {
    //         data: {
    //             [`_all${list}sMeta`]: { count },
    //         },
    //     } = await fetch({
    //         query: `
    //         query($search: String!) {
    //             _all${list}sMeta(where: ${whereString}) {
    //               count
    //             }
    //         }`,
    //         variables: {
    //             search: search,
    //         },
    //     })
    // setCallBack(Math.ceil(count / maxItemsPerPage))
    // })()
}

export const fetchDataWithGql = async (
    { list, columns, maxItemsPerPage },
    search,
    page,
    setCallBack
) => {
    console.log('fetchDataWithGql')
    // console.log(props)
    // console.log(list)
    // console.log(columns)
    // console.log(maxItemsPerPage)
    // console.log(search)
    // console.log(page)
    // console.log(setCallBack)
    const selectString = generateSelectString(columns)
    const whereString = generateWhereString(columns)
    // console.log(whereString)
    // console.log(selectString)
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
    console.log(data[`all${list}s`])
    return data[`all${list}s`]
}
