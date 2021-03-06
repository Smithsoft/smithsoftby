import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import * as footerStyles from './footer.module.scss';

const Footer = (): React.ReactElement => {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    author
                }
            }
        }
    `);
    return (
        <footer className={footerStyles.footer}>
            <p>
                Created by {data.site.siteMetadata.author} ©2020 |{' '}
                <a href="https://github.com/Smithsoft/GatsbyTypescript">Code is on GitHub</a>.
            </p>
        </footer>
    );
};

export default Footer;
