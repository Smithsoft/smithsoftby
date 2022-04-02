import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, graphql, StaticQuery } from 'gatsby';

import * as headerStyles from './header.module.scss';

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
    const siteHeader = props.data.settings.generalSettings;
    const links = generateLinks(props.data.menus.edges);
    return (
        <nav className="header navbar navbar-expand-md navbar-light bg-light">
            <div>
                <a className="navbar-brand" href="/" title={siteHeader.description}>{siteHeader.title}</a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {links}
            </div>
            <div>
            <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            <span className={headerStyles.siteTitle}><small>{siteHeader.description}</small></span>
            </div>
        </nav>
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
