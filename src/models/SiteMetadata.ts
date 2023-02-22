import { Author } from "./Author"
import { Social } from "./Social"

export type SiteMetaData = {
    title: string,
    author: Author,
    description: string,
    blurb: string,
    siteUrl: string,
    social: Social
}
