import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import SVG from 'react-inlinesvg';
import Img from 'gatsby-image';

import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { Element } from "domhandler/lib/node";
import Layout from '../components/layout';
import Head from '../components/head';
import { Row, Col, ButtonGroup, Button, Container } from 'react-bootstrap';

import * as pageStyles from './page.module.scss';

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

type LocalFile = {
    localFile: {
        publicURL: string
        childImageSharp: any
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
    const linkEl: Element | null = domNode.children.find(el => el.type === 'tag' && el.name === 'a')
    const linkHref = linkEl?.attribs?.rel ?? linkEl.attribs?.href ?? "#"
    const linkContent = domToReact(linkEl.children)
    return (
        <Button href={linkHref}>{linkContent}</Button>
        )
}

type ReplaceResult = JSX.Element | object | void | undefined | null | false

const transformer = (domNode:Element):ReplaceResult => {
    if (domNode.type === 'tag') {
        if (domNode.name === 'div') {
            const className = domNode.attribs.class
            if (className === 'wp-block-columns' ) {
                return (<Row>{domToReact(domNode.children, { replace: transformer })}</Row>)
            } else if (className === 'wp-block-column' ) {
                return (<Col>{domToReact(domNode.children, { replace: transformer })}</Col>)
            } else if (className === 'wp-block-buttons') {
                return (<ButtonGroup size='lg' className={pageStyles.btnContainer}>{domToReact(domNode.children, { replace: transformer })}</ButtonGroup>)
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
  
/**
 * Pre-process the SVG to remove any 'width' or 'height' attributes
 * on the main SVG tag. This is necessary for the SVG to appear centered
 * and to resize with the fluid div that it is framed by.
 * @param code 
 */
const PreProcess = (code: string): string => {
    const SVGTagRegex = /<\s*svg[^>]*>/ ;
    const openSVGTag = code.match(SVGTagRegex);
    if (openSVGTag && openSVGTag.length > 0) {
        var openSVGTagStr = openSVGTag[0];
        code = code.substr(openSVGTagStr.length);
        openSVGTagStr = openSVGTagStr.replace(/width="[0-9]+"/g, '');
        openSVGTagStr = openSVGTagStr.replace(/height="[0-9]+"/g, '');
        code = openSVGTagStr + code;
    }
    return code;
};

type StateType = {
    heroImageSVG: any | null
    heroImageSharp: any | null
    loadingMessage: string
}

class Post extends React.Component<PropType, StateType> {

    constructor(props: PropType) {
        super(props);
        this.state = { 
            heroImageSVG: null, 
            heroImageSharp: null,
            loadingMessage: "Loading..." };
    }

    componentDidMount(): void {
        const media = this.props.data.wpPage.featuredImage.node;
        const imgUrl = media.localFile.publicURL;
        if (!imgUrl.startsWith('/static/')) {
            throw new Error('SVG URL is unexpected: ' + imgUrl);
        }
        const staticPath = imgUrl.replace(/^(\/static\/)/, '');

        if (imgUrl.endsWith("SVG") || imgUrl.endsWith("svg")) {
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
        } else {
            this.setState({ heroImageSharp: media.localFile.childImageSharp })
        }
    }
    render(): ReactNode {
        let heroImage = <p>{this.state.loadingMessage}</p>;
        if (this.state.heroImageSVG !== null) {
            heroImage = (
                <Container className={pageStyles.svgContainer} fluid>
                    <SVG
                        preProcessor={PreProcess}
                        src={this.state.heroImageSVG}
                        title={this.props.data.wpPage.featuredImage.caption}
                    ></SVG>
                </Container>
            );
        } else if (this.state.heroImageSharp !== null) {
            heroImage = (
                <Img fluid={this.state.heroImageSharp} title={this.props.data.wpPage.featuredImage.caption} />
            );
        }
        return (
            <Layout>
                <Head title={this.props.data.wpPage.title} />
                {heroImage}
                {parse(this.props.data.wpPage.content, options)}
            </Layout>
        );
    }
}

export default Post;
