import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const JOIN_MUTATION = gql`
    mutation join($secretToken: String!) {
        join(secretToken: $secretToken) {
            ...UserFragment
        } 
    }
    ${USER_FRAGMENT}
`;

export default JOIN_MUTATION;
