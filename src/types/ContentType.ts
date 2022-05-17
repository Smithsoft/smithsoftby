import FeaturedImageNode from "./FeaturedImageNode"

type ContentType = {
    id: string
    slug: string
    content: string
    date: string
    title: string
    featuredImage: FeaturedImageNode
}

export default ContentType