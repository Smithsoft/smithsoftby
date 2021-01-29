import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import parse from 'html-react-parser';

export const query = graphql`
query($id: String) {
    wpPost(id: { eq: $id }) {
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

type PostType = {
    id: string
    slug: string
    content: string
    date: string
    featuredImage: FeaturedImageType
}

type PropType = {
    data: {
        wpPost: PostType;
    }
}

class Post extends React.Component<PropType> {
    render(): ReactNode {
        console.log(this.props);
        return (
            <div>
                {parse(this.props.data.wpPost.content)}
            </div>
        );
    }
}

export default Post;
