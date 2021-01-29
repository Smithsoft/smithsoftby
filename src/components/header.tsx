import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, graphql, StaticQuery } from 'gatsby';

import headerStyles from './header.module.scss';

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

type PropType = {
    data: {
        allWpMenuItem: {
            edges: MenuItem[];
        }
    }
}

const findSiteHeaderLink = (data: MenuItem[]): MenuItem => {
    console.log(data)
    return data.find(menuItem => menuItem.node.path === '/' )
}

const generateLinks = (data: MenuItem[]): React.ReactElement[] => {
    const result = data.map((menuItem):React.ReactElement => {
        return (<li key={menuItem.node.id}>
            <Link
                className={headerStyles.navItem}
                activeClassName={headerStyles.activeNavItem}
                to={menuItem.node.path}
            >
                {menuItem.node.label}
            </Link>
        </li>);
    });
    return result;
}

const Header = (props: PropType): React.ReactElement => {
    console.log(props);
    const siteHeader = findSiteHeaderLink(props.data.allWpMenuItem.edges);
    const links = generateLinks(props.data.allWpMenuItem.edges);
    return (
        <header>
            <h1>
                <Link className={headerStyles.title} to="/">
                    {siteHeader.node.title}
                </Link>
            </h1>
            <nav>
                <ul className={headerStyles.navList}>
                    {links}
                </ul>
            </nav>
        </header>
    );
};

export default function MenuHeader(props) {
    return (
      <StaticQuery
        query={graphql`
          query {
            allWpMenuItem(filter: {locations: {eq: PRIMARY}}) {
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
          }
        `}
        render={data => <Header data={data} {...props} />}
      />
    )
  }
