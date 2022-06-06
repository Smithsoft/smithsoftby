import { IGatsbyImageData } from "gatsby-plugin-image"

type LocalFile = {
    localFile: {
        publicURL?: string
        childImageSharp?: IGatsbyImageData
    }
}

export default LocalFile