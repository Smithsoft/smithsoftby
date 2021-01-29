import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import parse from 'html-react-parser';
import Layout from '../components/layout';
import Head from '../components/head';

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
    title: string
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
            <Layout>
                <Head title={this.props.data.wpPage.title} />
                <div>
                {parse(this.props.data.wpPage.content)}
            </div>
        </Layout>
            
        );
    }
}

export default Post;
