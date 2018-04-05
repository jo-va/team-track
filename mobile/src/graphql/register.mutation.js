import gql from 'graphql-tag';

const REGISTER_MUTATION = gql`
    mutation register($username: String!, $email: String!, $password: String!) {
        jwt: register(username: $username, email: $email, password: $password) 
    }
`;

export default REGISTER_MUTATION;
