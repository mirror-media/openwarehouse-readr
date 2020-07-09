import { createApolloFetch } from 'apollo-fetch';

const fetch = createApolloFetch({
    uri: '/admin/api',
});

function generateSelectString(columns) {
    return columns.join('\n');
}

function generateWhereString(columns) {
    const exclusion = ['duration'];
    return `{OR: [${columns.filter(column => !exclusion.includes(column)).map(column => `{${column}_contains: $search}`).join()}]}`;
}

export const setPages = ({ list, columns, maxItemsPerPage }, search, setCallBack) => {
    (async () => {
        const whereString = generateWhereString(columns);
        const { data: { [`_all${list}sMeta`]: { count } } } = await fetch({
            query: `
            query($search: String!) {
                _all${list}sMeta(where: ${whereString}) {
                  count
                }
            }`,
            variables: {
                search: search,
            },
        });
        setCallBack(Math.ceil(count / maxItemsPerPage));
    })();
}

export const setData = ({ list, columns, maxItemsPerPage }, search, page, setCallBack) => {
    (async () => {
        const selectString = generateSelectString(columns);
        const whereString = generateWhereString(columns);
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
        });
        setCallBack(data[`all${list}s`]);
    })();
}