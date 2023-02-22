import * as React from "react"
import { graphql } from "gatsby"

import Bio from "../components/Bio"
import Layout from "../components/Layout"
import Seo from "../components/Seo"

import MobileDev from "../assets/mobile-dev.svg"
import { Menu } from "../models/Menu"
import { SiteMetaData } from "../models/SiteMetadata"

type HomeIndexArgs = {
    data: {
        site: {
            siteMetadata: Pick<SiteMetaData, 'title' | 'description' | 'blurb'> & Menu
        },
    },
    location: Location
}

const HomeIndex = ({ data, location }: HomeIndexArgs) => {
  const { title, description, blurb, menuLinks } = data.site.siteMetadata;

  return (
    <Layout location={location} title={title} menu={{ menuLinks }}>
        <MobileDev />
        <h3>{blurb}</h3>
      <Bio />
    </Layout>
  )
}

export default HomeIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = ({ location, data }: HomeIndexArgs) => 
    <Seo title={data.site.siteMetadata.title} description={data.site.siteMetadata.description} children={undefined} />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        description
        blurb
        menuLinks {
          name
          link
        }
      }
    }
    allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/content\/pages/"}}) {
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
