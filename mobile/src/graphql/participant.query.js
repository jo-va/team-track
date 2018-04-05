import gql from 'graphql-tag';

const PARTICIPANT_QUERY = gql`
    query participant {
        participant {
            id
            username
            user {
                id
            }
            group {
                name
            }
        }
    }
`;

export default PARTICIPANT_QUERY;
