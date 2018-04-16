import gql from 'graphql-tag';

const JOIN_MUTATION = gql`
    mutation join($username: String!, $secret: String!) {
        join(username: $username, secret: $secret) {
            id
            jwt
            username
        }
    }
`;

export default JOIN_MUTATION;
