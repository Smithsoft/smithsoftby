import React, { ReactNode } from 'react'
import { Element } from 'domhandler/lib/node'
import parse from 'style-to-object'

/**
 * Button comes from Gutenberg with a block level element and a child link element:
 * 
 * -- Plain Button (with 0px radius, default fill style, default font-style, default-text, default background)
 * 
 * Button block 
 * class: wp-block-button
 * 
 * Link element
 * class: wp-block-button__link 
 * rel: /app-calculator
 * 
 * 
 * -- Button with 12px radius, outline style, large font-style, white-text, coloured background
 *      Also has a custom CSS tag added: FaCalculator
 * 
 * Button block 
 * class: wp-block-button has-custom-font-size is-style-outline FaCalculator has-large-font-size
 * 
 * Link element
 * class: wp-block-button__link has-white-color has-text-color has-background
 * style: border-radius:12px;background-color:#f9a826
 * 
 * -----
 * 
 * 
 */

type PropType = {
    gutenbergElement: Element
}

import { domToReact } from 'html-react-parser'

class ButtonGt extends React.Component<PropType> {

    anchorRef = React.createRef<HTMLButtonElement>()

    linkEl = this.props.gutenbergElement.firstChild as Element
    blockEl = this.props.gutenbergElement as Element

    targetLink = this.linkEl.attribs['href'] || this.linkEl.attribs['rel'] || '#'
    linkStyleText = this.linkEl.attribs['style']
    linkStyle = parse(this.linkStyleText)
    blockClasses = this.blockEl.attribs['class'].split(/\s+/)
    linkClasses = this.linkEl.attribs['class'].split(/\s+/)
    buttonTreatment = this.blockClasses.includes('is-style-outline') ? 'outline-' : ''
    buttonTheme = this.blockClasses.includes('call-to-action') ? 'cta' : 'primary'
    buttonSize = this.blockClasses.includes('has-large-font-size') ? ' btn-lg' : ''

    constructor(props: PropType) {
        super(props)
    }
    
    render(): ReactNode {
        this.buttonTreatment === 'outline' ? 'outline-' : ''
        const bootstrap_classes = `btn btn${this.buttonTreatment}-${this.buttonTheme}${this.buttonSize}`
        return (
            <>
                <a 
                    className={bootstrap_classes} 
                    href={this.targetLink} 
                >{domToReact(this.linkEl.children)}</a>
            </>
        )
    }
}

export default ButtonGt