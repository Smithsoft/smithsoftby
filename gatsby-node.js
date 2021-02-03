const path = require(`path`);
const { slash } = require(`gatsby-core-utils`);

// https://swas.io/blog/using-multiple-queries-on-gatsbyjs-createpages-node-api/
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    // query content for WordPress posts
    const result = await graphql(`
        query {
            frontPage: wpPage(isFrontPage: {eq: true}) {
                title
                slug
                id
            }
            otherPages: allWpPage(filter: {status: {eq: "publish"}}) {
                edges {
                    node {
                        id
                        slug
                        content
                        title
                    }
                }
            }
            allPosts: allWpPost(filter: {status: {eq: "publish"}}) {
                edges {
                    node {
                        id
                        slug
                        content
                        title
                    }
                }
            }
        }
    `);

    const postTemplate = path.resolve(`./src/templates/post.tsx`);
    const pageTemplate = path.resolve(`./src/templates/page.tsx`);

    const allPosts = result.data.allPosts.edges;
    const otherPagesList = result.data.otherPages.edges;

    createPage({
        path: '/',
        component: slash(pageTemplate),
        context: {
            id: result.data.frontPage.id
        }
    });
    allPosts.forEach((post) => {
        createPage({
            // will be the url for the page
            path: post.node.slug,
            // specify the component template of your choice
            component: slash(postTemplate),
            // In the ^template's GraphQL query, 'id' will be available
            // as a GraphQL variable to query for this post's data.
            context: {
                id: post.node.id,
            },
        });
    });
    otherPagesList.forEach((page) => {
        if (page.node.title && page.node.content) {
            createPage({
                path: page.node.slug,
                component: slash(pageTemplate),
                context: {
                    id: page.node.id
                }
            });
        } else {
            console.log("Not creating a page " + page.node.id + ": empty title/content")
        }
    });
};
