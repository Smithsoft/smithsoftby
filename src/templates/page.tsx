import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import parse from 'html-react-parser';

export const query = graphql`
query($id: String!) {
    wpPage(id: { eq: $id }) {
        id
        slug
        content
        date
        featuredImage {
            node {
                localFile {
                    publicURL
                }
            }
        }
    }
}
`;

type LocalFile = {
    publicURL: string
}

type FeaturedImageType = {
    node: LocalFile
}

type PageType = {
    id: string
    slug: string
    content: string
    date: string
    featuredImage: FeaturedImageType
}

type PropType = {
    data: {
        wpPage: PageType;
    }
}

class Post extends React.Component<PropType> {
    render(): ReactNode {
        return (
            <div>
                {parse(this.props.data.wpPage.content)}
            </div>
        );
    }
}

export default Post;
