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
            postsPage: wpPage(isPostsPage: {eq: true}) {
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
                        date(formatString: "YYYY/MM/DD")
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
    const blogTemplate = path.resolve(`./src/templates/blog.tsx`);

    const allPosts = result.data.allPosts.edges;
    const otherPagesList = result.data.otherPages.edges;

    createPage({
        path: '/',
        component: slash(pageTemplate),
        context: {
            id: result.data.frontPage.id
        }
    });
    createPage({
        path: '/blog',
        component: slash(pageTemplate),
        context: {
            id: result.data.frontPage.id
        }
    });
    allPosts.forEach((post) => {
        console.log("Post create: " + post.node.id + " - " + post.node.slug)
        createPage({
            // will be the url for the page
            path: `${post.node.date}/${post.node.slug}`,
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
            console.log("Page create: " + page.node.id + " - " + page.node.slug)
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

exports.onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions, getConfig }) => {
    console.log('on create webpack config: ' + stage);
    if (stage === 'build-javascript') {
        console.log('building javascript');
        const config = getConfig();
        const miniCssExtractPlugin = config.plugins.find(
            (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin',
        );
        if (miniCssExtractPlugin) {
            console.log('###### Got plugin');
            miniCssExtractPlugin.options.ignoreOrder = true;
        }
        actions.replaceWebpackConfig(config);
    }
};