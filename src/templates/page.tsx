import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import Content from '../components/content';
import ContentType from '../types/ContentType';

export const query = graphql`
query($id: String!) {
    wpPage(id: { eq: $id }) {
        id
        slug
        content
        date
        title
        featuredImage {
            node {
                altText
                caption
                description
                localFile {
                    publicURL
                    childImageSharp {
                        fluid(maxWidth: 800) {
                          ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
}
`;

type PagePropType = {
    data: {
        wpPage: ContentType;
    }
}

class Page extends Content<PagePropType> {

    getContentFields(): ContentType {
        return this.props.data.wpPage
    }
}

export default Page;
