import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Footer from './footer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MenuHeader from './header';

import '../styles/index.scss';
import * as layoutStyles from './layout.module.scss';

import { Container, Row } from 'react-bootstrap';

/**
 * Layout is the top level element in all pages.
 * 
 *   Semantic element layout to work w assistice technologies
 * <header>
 *      <h1>Site name</h1><!-- brand here -->
 *      <nav></nav>
 * </header>
 * <main>
 *      <div>
 *          <img>Hero image</img>
 *      </div>
 *      <section>
 *      </section>
 *      <section>
 *      </section>
 * </main>
 * <footer></footer>
 * 
        https://www.w3schools.com/html/html5_semantic_elements.asp

        https://developer.mozilla.org/en-us/docs/Web/HTML/Element/main
 *  
 * */ 
const Layout = (props: { children: React.ReactNode }): React.ReactElement => {
    return (
        <Container>
            <header>
                <MenuHeader />
            </header>
            <main>
                {props.children}
            </main>
            <Footer />
        </Container>
    );
};

export default Layout;
