import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Footer from './footer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MenuHeader from './header';

import '../styles/index.scss';
import { Container } from 'react-bootstrap';

/**
 *   Semantic element layout to work w assistice technologies
 * <header>
 *      <h1>Site name</h1><!-- brand here -->
 *      <nav></nav>
 *      <div><img>Hero image</img></div>
 * </header>
 * <main>
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
            <MenuHeader />
                {props.children}
            <Footer />
        </Container>
    );
};

export default Layout;
