import * as React from "react"
import { Link, graphql } from "gatsby"
import WorkingLate from "../assets/working-late.svg"
import Bio from "../components/Bio"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { SiteMetaData } from "../models/SiteMetadata"
import { Menu } from "../models/Menu"
import { PostRecord } from "../models/PostRecord"

type PostIndexArgs = { 
    data: { 
        site: {
            siteMetadata: Pick<SiteMetaData, 'title' | 'description'> & Menu
        },
        posts: {
            nodes: Array<  Omit<PostRecord, 'id'> >
        },
     },
    location: Location
}

const PostIndex = ({ data, location }: PostIndexArgs) => {
  const { title, menuLinks } = data.site.siteMetadata
  const posts = data.posts.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location!} title={'No Posts Found'} menu={{menuLinks}}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={'Posts'} menu={{menuLinks}}>
        <WorkingLate />
        <h3>All blog posts in reverse chronological order. Check the menu above for pages.</h3>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
      <Bio />
    </Layout>
  )
}

export default PostIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = (props: PostIndexArgs) => (
  <Seo title='Smithsoft Blog - All posts' description='Posts listing page' children={undefined} />
)

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        menuLinks {
          name
          link
        }
      }
    }
    posts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
