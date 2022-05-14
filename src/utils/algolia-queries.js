const escapeStringRegexp = require("escape-string-regexp")

const pagePath = `content`
const indexName = `Pages`

const pageQuery = `{
  pages: allMarkdownRemark(
    filter: {
      fileAbsolutePath: { regex: "/${escapeStringRegexp(pagePath)}/" },
    }
  ) {
    edges {
      node {
        id
        frontmatter {
          title
        }
        fields {
          slug
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`

    // query content for WordPress posts
    const page_query_2 = `
        query {
            frontPage: wpPage(isFrontPage: {eq: true}) {
                title
                slug
                id
            }
            otherPages: allWpPage(filter: {status: {eq: "publish"}}) {
                edges {
                    node {
                        id
                        slug
                        content
                        title
                    }
                }
            }
            allPosts: allWpPost(filter: {status: {eq: "publish"}}) {
                edges {
                    node {
                        id
                        slug
                        content
                        title
                    }
                }
            }
        }
    `


function pageToAlgoliaRecord({ node: { id, ...rest } }) {
  return {
    objectID: id,
    ...rest,
  }
}

const queries = [
  {
    query: page_query_2,
    transformer: ({ data }) => data.allPosts.edges.map(pageToAlgoliaRecord),
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
]

module.exports = queries