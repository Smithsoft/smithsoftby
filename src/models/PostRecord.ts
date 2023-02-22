import { Fields } from "./Fields"
import { Frontmatter } from "./Frontmatter"

export interface PostRecord {
    id: string,
    excerpt: string,
    html: string,
    fields: Fields,
    frontmatter: Frontmatter
}
