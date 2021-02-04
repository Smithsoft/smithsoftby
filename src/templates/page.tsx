import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import SVG from 'react-inlinesvg';

import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { Element } from "domhandler/lib/node";
import Layout from '../components/layout';
import Head from '../components/head';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';

import pageStyles from './page.module.scss';

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
                }
            }
        }
    }
}
`;

type LocalFile = {
    localFile: {
        publicURL: string
    }
}

type FeaturedImageNode = {
    node: LocalFile
    description: string
    caption: string
    altText: string
}

type PageType = {
    id: string
    slug: string
    content: string
    date: string
    title: string
    featuredImage: FeaturedImageNode
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
  

const PreProcess = (code: string): string => {
    const cleanString = code.replace(/width="[0-9.]+"/g, '');
    return cleanString.replace(/height="[0-9.]+"/g, '');
};

type StateType = {
    loadingMessage: string
    heroImageSVG: any | null
}

class Post extends React.Component<PropType, StateType> {

    constructor(props: PropType) {
        super(props);
        this.state = { 
            heroImageSVG: null, loadingMessage: "Loading..." };
    }

    componentDidMount(): void {
        const media = this.props.data.wpPage.featuredImage.node;
        const svgUrl = media.localFile.publicURL;
        if (!svgUrl.startsWith('/static/')) {
            throw new Error('SVG URL is unexpected: ' + svgUrl);
        }
        const staticPath = svgUrl.replace(/^(\/static\/)/, '');

        // webpack needs the dynamic version of import to specify that the path
        // is on the local relative part of the file system, and making the first
        // part of the path non-dynamic does this.
        // const { default: WomanWithPhoneImage } = await import(
        //     /* webpackInclude: /\.svg$/ */
        //     '../../public/static/' + staticPath
        // );
        // this.setState({ heroImageSVG: WomanWithPhoneImage });

        import(
            /* webpackInclude: /\.svg$/ */
            '../../public/static/' + staticPath
        ).then(({ default: PageHeroImage }) => {
            this.setState({ heroImageSVG: PageHeroImage, loadingMessage: "Done" });
        }, (reason: any) => {
            this.setState({ heroImageSVG: null, loadingMessage: `Failed: ${reason}` })
        });
    }
    render(): ReactNode {
        let heroImage = <p>{this.state.loadingMessage}</p>;
        if (this.state.heroImageSVG !== null) {
            heroImage = (
                <Container fluid>
                    <SVG
                        preProcessor={PreProcess}
                        src={this.state.heroImageSVG}
                        title={this.props.data.wpPage.featuredImage.caption}
                    ></SVG>
                </Container>
            );
        }
        return (
            <Layout>
                <Head title={this.props.data.wpPage.title} />
                {heroImage}
                <div>
                    {parse(this.props.data.wpPage.content, options)}
                </div>
            </Layout>
        );
    }
}

export default Post;
