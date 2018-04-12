import gql from 'graphql-tag';

const USER_FRAGMENT = gql`
    fragment UserFragment on User {
        id
        email
        username
        distance
        latitude
        longitude
        state
        group {
            name
            distance
            event {
                name
                distance
                state
            }
        }
    }
`;

export default USER_FRAGMENT;
