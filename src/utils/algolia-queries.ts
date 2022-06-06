const escapeStringRegexp = require("escape-string-regexp")

const pagePath = `content`
const indexName = `Pages`

const pageQuery = `
    query {
        allPages: allWpPage(filter: {status: {eq: "publish"}}) {
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

type Edge = {
    node: any
}
type Nodes = {
    edges: Edge[]
}
type AllPages = {
    allPages: Nodes
}
type AllPosts = {
    allPosts: Nodes
}
type QueryResponse = AllPages & AllPosts

type Input = { data: QueryResponse }

function pageToAlgoliaRecord({ node: { id, ...rest } }) {
  return {
    objectID: id,
    ...rest,
  }
}

const createRecords = ({ data }: Input) => {
    console.log("##### Creating algollia records")
    const posts = data.allPosts.edges.map(pageToAlgoliaRecord)
    const pages = data.allPosts.edges.map(pageToAlgoliaRecord)
    return [  ...posts, ...pages ]
}

const queries = [
  {
    query: pageQuery,
    transformer: createRecords,
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
]

module.exports = queries