
import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/Bio"
import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { Menu } from "../models/Menu"
import { SiteMetaData } from "../models/SiteMetadata"
import { PostRecord } from "../models/PostRecord"
import { Frontmatter } from "../models/Frontmatter"

type PostLink = Pick<PostRecord, 'fields' | 'frontmatter'>

type PageTemplateProps = {
    data: {
        site: {
            siteMetadata: Pick<SiteMetaData, 'title'> & Menu
        },
        page: Omit<PostRecord, 'fields'>
    },
    location: Location
}

const PageTemplate: React.FC<PageTemplateProps> = ({ data, location }) => {
    const {
        site: {
            siteMetadata: { menuLinks },
        },
        page,
    } = data

    return (
      <Layout location={location} title={page.frontmatter.title} menu={{ menuLinks }}>
        <article
          className="blog-post"
          itemScope
          itemType="http://schema.org/Article"
        >
            <section>
                <div className="note-panel info">
                    This is no longer a consulting business.
                    I ran Smithsoft from 2012 to 2021, consulting and building apps. 
                        Below is archived content from those days.
                </div>
            </section>
          <section
            dangerouslySetInnerHTML={{ __html: page.html }}
            itemProp="articleBody"
          />
          <hr />
          <footer>
            <Bio />
          </footer>
        </article>
      </Layout>
    )
}

type HeadProps = {
    data: { page: { frontmatter: Frontmatter }}
}

export const Head: React.FC<HeadProps> = ({ data: { page } }) => {
  return (
    <Seo
      title={page.frontmatter.title}
      description={page.frontmatter.description}
      children={undefined}
    />
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
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
    page: markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
