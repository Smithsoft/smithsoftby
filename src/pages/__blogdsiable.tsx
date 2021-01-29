import React from 'react';

import { graphql } from 'gatsby';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Layout from '../components/layout';

import MarkdownPosts from '../components/MarkdownPosts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BlogListing from '../components/bloglisting';

import blogStyles from './blog.module.scss';
import Head from '../components/head';

//highlight-start
export const pageQuery = graphql`
    query {
        allWpPost(sort: { fields: [date] }) {
            nodes {
                title
                excerpt
                slug
            }
        }
    }
`;

const BlogPages = (): React.ReactElement => {
    return (
        <Layout>
            <Head title="Blog" />
            <h1>Blog</h1>
        </Layout>
    );
};

export default BlogPages;
