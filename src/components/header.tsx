import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link, graphql, StaticQuery } from 'gatsby';

import headerStyles from './header.module.scss';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';

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
    return data.find(menuItem => menuItem.node.path === '/' )
}

const generateLinks = (data: MenuItem[]): React.ReactElement[] => {
    const result = data.map((menuItem):React.ReactElement => {
        return (
            <Nav.Link key={menuItem.node.id} href={menuItem.node.path}>{menuItem.node.label}</Nav.Link>
        );
    });
    return result;
}

const Header = (props: PropType): React.ReactElement => {
    const siteHeader = findSiteHeaderLink(props.data.allWpMenuItem.edges);
    const links = generateLinks(props.data.allWpMenuItem.edges);
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">{siteHeader.node.title}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">{links}</Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
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
