import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, graphql, StaticQuery } from 'gatsby';

import headerStyles from './header.module.scss';
import { Col, Navbar } from 'react-bootstrap';

type MenuId = {
    id: string
}

type MenuItem = {
    node: {
        label:string
        id: string
        path: string
        target: string
        title: string
        url: string
        childItems: {
            nodes: MenuId[]
        }
    }
}

type SiteSettings = {
    generalSettings: {
        description: string
        title: string
        email: string
        url: string
    }
}

type PropType = {
    data: {
        menus: {
            edges: MenuItem[];
        }
        settings: SiteSettings
    }
}

const generateLinks = (data: MenuItem[]): React.ReactElement[] => {
    const result = data.map((menuItem):React.ReactElement => {
        return (
            <Link to={menuItem.node.path} key={menuItem.node.path} className={headerStyles.navItem} activeClassName={headerStyles.activeNavItem}>
                {menuItem.node.label}
            </Link>
        );
    });
    return result;
}

const Header = (props: PropType): React.ReactElement => {
    console.log(props)
    const siteHeader = props.data.settings.generalSettings;
    const links = generateLinks(props.data.menus.edges);
    return (
        <Navbar className="header" expand="md" bg="light">
            <Col>
                <Navbar.Brand href="/" title={siteHeader.description}>{siteHeader.title}</Navbar.Brand>
                <Navbar.Text className={headerStyles.siteTitle}>{siteHeader.description}</Navbar.Text>
            </Col>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                {links}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default function MenuHeader(props) {
    return (
      <StaticQuery
        query={graphql`
            query {
                menus: allWpMenuItem(filter: {locations: {eq: PRIMARY}}) {
                    edges {
                        node {
                            label
                            id
                            path
                            target
                            title
                            url
                            childItems {
                                nodes {
                                    id
                                }
                            }
                        }
                    }
                }
                settings: wp {
                    generalSettings {
                        description
                        title
                        email
                        url
                    }
                }
            }
        `}
        render={data => <Header data={data} {...props} />}
      />
    )
  }
