/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */
import { GatsbyConfig } from "gatsby"

type SerialiseArgs = {
    query: {
        site: GatsbyConfig,
        allMarkdownRemark: {
            nodes: Array<{
                excerpt: string,
                html: string,
                fields: {
                    slug: string
                },
                frontmatter: {
                    title: string,
                    date: string
                }
            }>
        },
    }
}

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config: GatsbyConfig = {
    siteMetadata: {
        title: `Smithsoft Blog`,
        author: {
            name: `Sarah Smith`,
            summary: `Mobile App Developer`,
        },
        description: `Technology Blog and Portfolio`,
        blurb: `Professional portfolio, Smithsoft archive, and blog posts by Sarah Smith.`,
        siteUrl: `https://smithsoft.com.au/`,
        social: {
            twitter: `SarahHackSmith`,
        },
        menuLinks: [
            {
                name: 'home',
                link: '/home/'
            },
            {
                name: 'about',
                link: '/about/'
            },
            {
                name: 'portfolio',
                link: '/portfolio/'
            },
            {
                name: 'posts',
                link: '/posts/'
            },
        ]
    },
    plugins: [
        `gatsby-plugin-image`,
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: /assets/
                }
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/pages`,
                name: `pages`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 630,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    `gatsby-remark-prismjs`,
                ],
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                    {
                        site {
                            siteMetadata {
                                title
                                description
                                siteUrl
                                site_url: siteUrl
                            }
                        }
                    }
                    `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }: SerialiseArgs) => {
                            return allMarkdownRemark.nodes.map(node => {
                                return Object.assign({}, node.frontmatter, {
                                    description: node.excerpt,
                                    date: node.frontmatter.date,
                                    url: site.siteMetadata?.siteUrl + node.fields.slug,
                                    guid: site.siteMetadata?.siteUrl + node.fields.slug,
                                    custom_elements: [{ "content:encoded": node.html }],
                                })
                            })
                        },
                        query: `{
                            allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                                nodes {
                                    excerpt
                                    html
                                    fields {
                                        slug
                                    }
                                    frontmatter {
                                        title
                                        date
                                    }
                                }
                            }
                            }`,
                        output: "/rss.xml",
                        title: "Gatsby Starter Blog RSS Feed",
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Gatsby Starter Blog`,
                short_name: `Gatsby`,
                start_url: `/`,
                background_color: `#ffffff`,
                // This will impact how browsers show your PWA/website
                // https://css-tricks.com/meta-theme-color-and-trickery/
                // theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/smithsoft-logo.png`, // This path is relative to the root of the site.
            },
        },
    ],
}

export default config;