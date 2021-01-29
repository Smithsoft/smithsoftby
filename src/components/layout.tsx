import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Footer from './footer';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MenuHeader from './header';

import '../styles/index.scss';
import layoutStyles from './layout.module.scss';

const Layout = (props: { children: React.ReactNode }): React.ReactElement => {
    return (
        <div className={layoutStyles.container}>
            <div className={layoutStyles.content}>
                <MenuHeader />
                {props.children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
