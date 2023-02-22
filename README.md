# Smithsoft Blog

This is based on the [Gatsby blog starter](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog/).

# Modifications

* [Converted to Typescript](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/#migrating-to-typescript)

## Building

```
npm install --legacy-peer-deps
npm build
```

## Develop

```
npm start
open http://localhost:8000
```

## Writing

* Write pages under `/content/pages`
* Write blog posts under `/content/blog`
* Add front matter to these:

```bash
# Use this to get a date/time string for the front matter
date -u +"%Y-%m-%dT%H:%M:%S.000Z"
```

## Troubleshooting

```
rm -Rf node_modules
npm install --legacy-peer-deps
```

In `package.json` the `overrides` stanza is added because of [an issue 
with Gatsby](https://github.com/gatsbyjs/gatsby/issues/37242#issuecomment-1396620944)
pulling in an experimental version of webpack.