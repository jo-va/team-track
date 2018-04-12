import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const CURRENT_USER_QUERY = gql`
    query currentUser {
        currentUser {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default CURRENT_USER_QUERY;
