import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const ME_QUERY = gql`
    query me {
        me {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default ME_QUERY;
