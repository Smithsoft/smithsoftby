import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/Bio"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { Menu } from "../models/Menu"
import { SiteMetaData } from "../models/SiteMetadata"
import { PostRecord } from "../models/PostRecord"
import { Frontmatter } from "../models/Frontmatter"
import { Fields } from "../models/Fields"

type PostLink = Pick<PostRecord, "fields"> & {
  frontmatter: Pick<Frontmatter, "title">
}

type PostTemplateProps = {
  data: {
    site: {
        siteMetadata: Pick<SiteMetaData, "title"> & Menu
    }
    post: Omit<PostRecord, "slug">
    previous: PostLink
    next: PostLink
  }
  location: Location
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data, location }) => {
    const {
        post,
        previous,
        next,
        site: {
            siteMetadata: { title, menuLinks },
        },
    } = data

    return (
        <Layout location={location} title={post.frontmatter.title} menu={{ menuLinks }}>
            <article
                className="blog-post"
                itemScope
                itemType="http://schema.org/Article"
            >
                <header>
                    <p>{post.frontmatter.date}</p>
                </header>
                <section
                    dangerouslySetInnerHTML={{ __html: post.html }}
                    itemProp="articleBody"
                />
                <hr />
                <footer>
                    <Bio />
                </footer>
            </article>
            <nav className="blog-post-nav">
                <ul
                style={{
                    display: `flex`,
                    flexWrap: `wrap`,
                    justifyContent: `space-between`,
                    listStyle: `none`,
                    padding: 0,
                }}
                >
                <li>
                    {previous && (
                    <Link to={previous.fields.slug} rel="prev">
                        ← {previous.frontmatter.title}
                    </Link>
                    )}
                </li>
                <li>
                    {next && (
                    <Link to={next.fields.slug} rel="next">
                        {next.frontmatter.title} →
                    </Link>
                    )}
                </li>
                </ul>
            </nav>
        </Layout>
  )
}

type HeadProps = {
    data: { post: { frontmatter: Frontmatter }}
}

export const Head: React.FC<HeadProps> = ({ data: { post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description}
      children={undefined}
    />
  )
}

export default PostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        menuLinks {
          name
          link
        }
      }
    }
    post: markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
