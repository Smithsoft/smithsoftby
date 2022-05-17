import { graphql } from 'gatsby';
import ContentType from '../types/ContentType';
import Content from '../components/content';

export const query = graphql`
query($id: String) {
    wpPost(id: { eq: $id }) {
        id
        slug
        content
        date
        title
        featuredImage {
            node {
                localFile {
                    publicURL
                    childImageSharp {
                        fluid(maxWidth: 800) {
                          ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
}
`;

type PostPropType = {
    data: {
        wpPost: ContentType;
    }
}

class Post extends Content<PostPropType> {

    getContentFields(): ContentType {
        return this.props.data.wpPost
    }
}

export default Post;
