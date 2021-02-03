import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import parse, { attributesToProps, DOMNode, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { Element } from "domhandler/lib/node";
import Layout from '../components/layout';
import Head from '../components/head';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';

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

const createButton = (domNode: Element): JSX.Element => {
    console.log(domNode)
    console.log(domNode.children)
    const linkEl: Element | null = domNode.children.find(el => el.type === 'tag' && el.name === 'a')
    const linkHref = linkEl?.attribs?.rel ?? linkEl.attribs?.href ?? "#"
    const linkContent = domToReact(linkEl.children)
    return (
        <Button href={linkHref}>{linkContent}</Button>
        )
}

type ReplaceResult = JSX.Element | object | void | undefined | null | false

const transformer = (domNode:Element):ReplaceResult => {
    // if (domNode.type === 'text') {
    //     console.log(`    \"${domNode.children}\"`)
    // } else {
    //     console.log("Node: " + domNode.type + " " + domNode.name)
    // }
    if (domNode.type === 'tag') {
        if (domNode.name === 'div') {
            console.log("Attrs for div:")
            console.log(domNode.attribs)
            const className = domNode.attribs.class
            if (className === 'wp-block-columns' ) {
                return (<Row>{domToReact(domNode.children, { replace: transformer })}</Row>)
            } else if (className === 'wp-block-column' ) {
                return (<Col>{domToReact(domNode.children, { replace: transformer })}</Col>)
            } else if (className === 'wp-block-buttons') {
                return (<ButtonGroup>{domToReact(domNode.children, { replace: transformer })}</ButtonGroup>)
            } else if (className === 'wp-block-button') {
                return createButton(domNode)
            }
        }
    }
}

const options: HTMLReactParserOptions = {
    replace: transformer,
    trim: true
};
  

class Post extends React.Component<PropType> {
    render(): ReactNode {
        return (
            <Layout>
                <Head title={this.props.data.wpPage.title} />
                <div>
                    {parse(this.props.data.wpPage.content, options)}
                </div>
            </Layout>
        );
    }
}

export default Post;
