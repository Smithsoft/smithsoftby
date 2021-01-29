import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Layout from '../components/layout';
import Head from '../components/head';
import Maintenance from '../components/maintenance';

// const PreProcess = (code: string): string => {
//     const cleanString = code.replace(/width="[0-9.]+"/g, '');
//     return cleanString.replace(/height="[0-9.]+"/g, '');
// };

type PageInfo = {
    id: string;
    title: string;
    slug: string;
    content: string;
    date: string;
    status: string;
};

type PagesListing = {
    nodes: PageInfo[];
};

type PageData = {
    allWpPage: PagesListing;
};

class IndexPage extends React.Component<PageData> {
    render(): React.ReactElement {
        return (
            <StaticQuery
                query={graphql`
                    query {
                        allWpPage(filter: { isFrontPage: { eq: true }, status: { eq: "publish" } }) {
                            nodes {
                                id
                                title
                                slug
                                content
                                date(formatString: "ddd MM DD YYYY")
                                status
                            }
                        }
                    }
                `}
                render={(data: PageData) => {
                    const pageListing = data.allWpPage.nodes;
                    if (pageListing.length > 0) {
                        const indexPage = pageListing[0];
                        console.log(indexPage);
                        return (
                            <Layout>
                                <Head title={indexPage.title} />
                            </Layout>
                        );
                    } else {
                        return <Maintenance />;
                    }
                }}
            />
        );
    }
}

export default IndexPage;
