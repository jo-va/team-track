import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const JOIN_GROUP_MUTATION = gql`
    mutation joinGroup($secretToken: String!) {
        joinGroup(secretToken: $secretToken) {
            ...UserFragment
        } 
    }
    ${USER_FRAGMENT}
`;

export default JOIN_GROUP_MUTATION;
