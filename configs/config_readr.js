module.exports = {
    app: {
        project: 'readr',
        authList: 'User',
        applicationName: 'readr',
        uuid: 'readr-stone-cms',
        dropDatabase: false,
        isGraphQLCached: false,
        isAdminAppRequired: true,
    },
    database: {
        host: '35.194.218.138',
        db: 'liyi-readr-local-dev',
        acc: 'keystone_agent',
        pass: 'BeAStableKeystoneInMirror',
    },
    // database: {
    //     host: '35.194.218.138',
    //     db: 'cms_stone',
    //     acc: 'keystone_agent',
    //     pass: 'BeAStableKeystoneInMirror',
    // },
    session: {
        cookieSecret: '39c28f856130f632e752383ab721129f081e7365d55aeb749a42e3fd3f0ba082',
        ttl: 3600,
    },
    storage: {
        imgUrlBase: 'https://storage.googleapis.com/static-readr-tw-dev/',
        bucket: 'static-readr-tw-dev',
        // bucket: 'mirrormedia-files'
    },
    redis: {
        type: 'single', // available values: cluster, single
        nodes: [
            {
                host: '35.229.222.166',
                port: '6379',
            },
        ],
        options: {
            authPass: 'ZgbRu7SP',
        },
    },
}
