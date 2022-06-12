import { nodeModuleNameResolver } from "typescript"

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
                    date(formatString: "YYYY/MM/DD")
                    content
                    title
                }
            }
        }
    }
`

type WPPage = {
    id: string
    slug: string
    content: string
    title: string
}

type WPPost = {
    id: string
    slug: string
    date: string
    content: string
    title: string
}

type Edge = {
    node: WPPost | WPPage
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

function pageToAlgoliaRecord({ id, ...rest } : WPPage) {
  return {
    objectID: id,
    ...rest,
  }
}

function postToAlgoliaRecord({ id, slug, date, ...rest } : WPPost) {
    const algoliaRecord = {
      objectID: id,
      ...rest,
      slug: `${date}/${slug}`
    }
    return algoliaRecord
}

const createRecords = ({ data }: Input) => {
    const posts = data.allPosts.edges.map( (n) => { return postToAlgoliaRecord(n.node as WPPost) } )
    const pages = data.allPages.edges.map( (n) => { return pageToAlgoliaRecord(n.node as WPPage) } )
    const results = [  ...posts, ...pages ]
    console.log(results.map((r) => { return { id: r.objectID, slug: r.slug }  }))
    return results
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