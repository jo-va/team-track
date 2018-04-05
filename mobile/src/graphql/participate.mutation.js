import gql from 'graphql-tag';

const PARTICIPATE_MUTATION = gql`
    mutation participate($secretToken: String!) {
        participate(secretToken: $secretToken) {
            username
            group {
                name
            }
        } 
    }
`;

export default PARTICIPATE_MUTATION;
