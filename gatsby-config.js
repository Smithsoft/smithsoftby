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
    ],
};
