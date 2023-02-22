import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import Seo from "../components/Seo"
import { DataParameters } from "../models/DataParameters"

type NotFoundProps = Pick<DataParameters, 'data' | 'location' >

const NotFoundPage: React.FC<NotFoundProps> = ({ data, location }) => {
  const siteTitle = data!.site.siteMetadata.title

  return (
    <Layout location={location!} title={siteTitle!}>
      <h1>404: Not Found</h1>
      <p>Could not find a page at {location!.pathname}.</p>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" children={undefined} />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
