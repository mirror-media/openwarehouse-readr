module.exports = {
    app: {
        project: 'mirror-tv',
        authList: 'User',
        applicationName: 'mirror TV',
        uuid: 'tv-stone-cms',
        dropDatabase: false,
        isGraphQLCached: false,
        isAdminAppRequired: true,
    },
    database: {
        host: '35.194.218.138',
        db: 'liyi-mtv-local-dev',
        acc: 'keystone_agent',
        pass: 'BeAStableKeystoneInMirror',
    },
    // database: {
    //     host: '34.80.142.137',
    //     db: 'tv_stone',
    //     acc: 'eve_polastri',
    //     pass: 'villanelle',
    // },
    session: {
        cookieSecret: 'c1038ce132ee87fd3878cb049bb9bd5aec892ec3b75a310a8584809e9edc4da1',
        ttl: 3600,
    },
    storage: {
        imgUrlBase: 'https://storage.googleapis.com/static-mnews-tw-dev/',
        bucket: 'static-mnews-tw-dev',
    },
    // redis: {
    //     type: 'cluster', // available values: cluster, single
    //     nodes: [
    //         {
    //             port: 7000,
    //             host: "10.140.0.21",
    //         },
    //         {
    //             port: 7001,
    //             host: "10.140.0.21",
    //         },
    //         {
    //             port: 7002,
    //             host: "10.140.0.21",
    //         },
    //     ],
    //     options: { // options are optional
    //         authPass: 'ZaaBCU9IzPx1E0CvFYC2SfqB7I7vYjO36B2dhLMe4cE3yDLVHo7ovpaGLXMSg4faAGugBS70MNhzZmLPlfjFEN2SqIP6aZ9Klq83ykeJ8fXAoP2biE7aVzrtNDypJYmezgIzGa4VbfojlhzDEIzPXxVTloOo3zHaKQ7aLdNCJGAkaaqJXFJn8sgKy4lC9ZA6waE2RpZSib7771QYnfKqMHOQrpaumX9b6YtimAdIcHu2Dfpej7oN6WB2rqBOqeAfjbRkt8k2OSQviS1f4sGMgUtbA7TSGZpgcBLOU22giarBWUcgPlpQJi7IcTDrPhK3QUpNb4pAeU1u6lLpr2gJ4kpVSDry7lShqNewG0c5j0SqdbyRldl5G19fJ8XtlnFek4JDO3TZuVLcnNQcziyF114fdohh6KNSC3SkF4WCeI4arP0TEUhq8Rntr2CA7ICoecuDQeSAlaWp0FGZPdr8H7R1MRpOQeweM8jDtSHohM20f2GxE8YYVEbUCpv2ZVWE',
    //         scaleReads: "slave", // only works in cluster. available values: all, master, slave. see: https://github.com/luin/ioredis
    //     }
    // },
    redis: {
        type: 'single', // available values: cluster, single
        nodes: [
            {
                host: '127.0.0.1',
                port: '6379',
            },
        ],
        options: {
            authPass:
                '1609cf1d9fac29834cfb91bae7c959fec8d5721c0f9777336feeccd52e297791e33242003b39d63812658a65c1dae7ccc2b71574734c55903c69c1643465430d3d3170d36b435f9f26bb1c126f3da6e35a5b7a6135dd17452ccbbc0a71507c3412d03491409e5969cf597cca21dca735338f3224d87cc7d8eeda47dd44207286',
        },
    },
}
