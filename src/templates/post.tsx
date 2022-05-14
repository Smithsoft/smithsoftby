import React, { ReactNode } from 'react';
import { graphql } from 'gatsby';

import SVG from 'react-inlinesvg';
import Img from 'gatsby-image';

import parse from 'html-react-parser';
import Layout from '../components/layout';
import Head from '../components/head';

import * as pageStyles from './page.module.scss';

export const query = graphql`
query($id: String) {
    wpPost(id: { eq: $id }) {
        id
        slug
        content
        date
        title
        featuredImage {
            node {
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


type PostType = {
    id: string
    slug: string
    content: string
    date: string
    title: string
    featuredImage: FeaturedImageNode
}

type PropType = {
    data: {
        wpPost: PostType;
    }
}

type StateType = {
    pageHasFeaturedImage: 'unknown' | 'no' | 'yes'
    heroImageSVG: any | null
    heroImageSharp: any | null
    loadingMessage: string
}

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

class Post extends React.Component<PropType, StateType> {

    constructor(props: PropType) {
        super(props);
        this.state = { 
            pageHasFeaturedImage: 'unknown',
            heroImageSVG: null, 
            heroImageSharp: null,
            loadingMessage: "Loading..." };
    }

    componentDidMount(): void {
        console.log('############')
        if (this.props.data.wpPost.featuredImage === null) {
            this.setState({ pageHasFeaturedImage: 'no' })
            console.log(`Page id: ${this.props.data.wpPost.id} - ${this.props.data.wpPost.slug} has no feature image!`);
            return;
        }
        const media = this.props.data.wpPost.featuredImage.node;
        const imgUrl = media.localFile.publicURL;
        if (!imgUrl.startsWith('/static/')) {
            throw new Error('SVG URL is unexpected: ' + imgUrl);
        }
        const staticPath = imgUrl.replace(/^(\/static\/)/, '');

        console.log('component mount: ' + imgUrl)

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
                this.setState({ pageHasFeaturedImage: 'yes', heroImageSVG: PageHeroImage, loadingMessage: "Done" });
            }, (reason: any) => {
                this.setState({ pageHasFeaturedImage: 'no', heroImageSVG: null, loadingMessage: `Failed: ${reason}` })
            });
        } else {
            this.setState({ pageHasFeaturedImage: 'yes', heroImageSharp: media.localFile.childImageSharp })
        }
    }

    render(): ReactNode {
        console.log('ASDFASDFASDFASDF')
        let heroImage = <p>{this.state.loadingMessage}</p>;
        if (this.state.pageHasFeaturedImage !== 'no') {
            if (this.state.heroImageSVG !== null) {
                heroImage = (
                    <div className={`container-fluid ${pageStyles.svgContainer}`}>
                        <SVG
                            preProcessor={PreProcess}
                            src={this.state.heroImageSVG}
                            title={this.props.data.wpPost.featuredImage.caption}
                        ></SVG>
                    </div>
                );
            } else if (this.state.heroImageSharp !== null) {
                heroImage = (
                    <Img fluid={this.state.heroImageSharp} title={this.props.data.wpPost.featuredImage.caption} />
                );
            }
        } else {
            heroImage = (
                <hr />
            )
        }
        return (
            <Layout>
                <Head title={this.props.data.wpPost.title} />
                {heroImage}
                {parse(this.props.data.wpPost.content)}
            </Layout>
        );
    }
}

export default Post;
