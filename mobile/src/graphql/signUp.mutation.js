import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const SIGNUP_MUTATION = gql`
    mutation signUp($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
            jwt
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default SIGNUP_MUTATION;
