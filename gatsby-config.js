require("dotenv").config()
module.exports = {
    siteMetadata: {
        title: 'Smithsoft',
        author: 'Sarah Smith',
        name: 'Professional Portfolio Site',
        tagline: 'Articles, tools and showcase',
    },
    plugins: [
        'gatsby-plugin-typescript',
        {
            resolve: 'gatsby-source-wordpress',
            options: {
                url: 'http://dev.smithsoft.com.au/graphql',
                schema: {
                    perPage: 20, // currently set to 100
                    requestConcurrency: 5, // currently set to 15
                    previewRequestConcurrency: 2, // currently set to 5
                },
            },
        },
        'gatsby-plugin-sass',
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
                trackingId: '259700374',
            },
        },
        'gatsby-plugin-sharp',
        'gatsby-plugin-react-helmet',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: './src/images/',
            },
            __key: 'images',
        },
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: '/src/assets/', // See below to configure properly
                },
            },
        },
        {
            resolve: `gatsby-plugin-algolia`,
            options: {
                appId: process.env.GATSBY_ALGOLIA_APP_ID,
                apiKey: process.env.ALGOLIA_ADMIN_KEY,
                queries: require("./src/utils/algolia-queries")
            },
        }
    ],
};
