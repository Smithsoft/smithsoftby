import React, { ReactNode } from 'react';

import SVG from 'react-inlinesvg';
import Img from 'gatsby-image';

import parse, { DOMNode, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { Element } from "domhandler/lib/node";
import Layout from '../components/layout';
import Head from '../components/head';

import * as pageStyles from './content.module.scss';
import ButtonGt from './button-gt';
import ContentType from 'types/ContentType';

type ReplaceResult = JSX.Element | object | void | false

const transformer = (domNode: DOMNode): ReplaceResult => {
    //console.log(JSON.stringify(domNode, ['name', 'attribs', 'type', 'children']))
    if (domNode instanceof Element) {
        if (domNode.type === 'tag') {
            if (domNode.name === 'div') {
                const inner = domToReact(domNode.children, { replace: transformer })
                const srcClassName = domNode.attribs.class
                if (srcClassName.includes('wp-block-columns') ) {
                    return (<div className='row'>{inner}</div>)
                } else if (srcClassName.includes('wp-block-column')) {
                    return (<div className='col-sm'>{inner}</div>)
                } else if (srcClassName.includes('wp-block-buttons')) {
                    return (<div className={`btn-group ${pageStyles.btnContainer}`} role="group" aria-label="Button group">
                            {inner}</div>)
                } else if (srcClassName.includes('wp-block-button')) {
                    return (<ButtonGt gutenbergElement={domNode}></ButtonGt>)
                }
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
    pageHasFeaturedImage: 'unknown' | 'no' | 'yes'
    heroImageSVG: any | null
    heroImageSharp: any | null
    loadingMessage: string
}

class Content<PropType> extends React.Component<PropType, StateType> {

    constructor(props: PropType) {
        super(props);
        this.state = { 
            pageHasFeaturedImage: 'unknown',
            heroImageSVG: null, 
            heroImageSharp: null,
            loadingMessage: "Loading..." };
    }

    getContentFields(): ContentType {
        return null
    }

    componentDidMount(): void {
        const fields = this.getContentFields()
        if (fields.featuredImage === null) {
            this.setState({ pageHasFeaturedImage: 'no' })
            console.log(`Page id: ${fields.id} - ${fields.slug} has no feature image!`);
            return;
        }
        const media = fields.featuredImage.node;
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
                this.setState({ pageHasFeaturedImage: 'yes', heroImageSVG: PageHeroImage, loadingMessage: "Done" });
            }, (reason: any) => {
                this.setState({ pageHasFeaturedImage: 'no', heroImageSVG: null, loadingMessage: `Failed: ${reason}` })
            });
        } else {
            this.setState({ pageHasFeaturedImage: 'yes', heroImageSharp: media.localFile.childImageSharp })
        }
    }

    render(): ReactNode {
        const fields = this.getContentFields()
        let heroImage = <p>{this.state.loadingMessage}</p>;
        if (this.state.pageHasFeaturedImage !== 'no') {
            if (this.state.heroImageSVG !== null) {
                heroImage = (
                    <div className={`container-fluid ${pageStyles.svgContainer}`}>
                        <SVG
                            preProcessor={PreProcess}
                            src={this.state.heroImageSVG}
                            title={fields.featuredImage.caption}
                        ></SVG>
                    </div>
                );
            } else if (this.state.heroImageSharp !== null) {
                heroImage = (
                    <Img fluid={this.state.heroImageSharp} title={fields.featuredImage.caption} />
                );
            }
        } else {
            heroImage = (
                <hr />
            )
        }
        return (
            <Layout>
                <Head title={fields.title} />
                {heroImage}
                {parse(fields.content, options)}
            </Layout>
        );
    }
}

export default Content;
