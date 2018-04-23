import gql from 'graphql-tag';

const PARTICIPANT_FRAGMENT = gql`
    fragment ParticipantFragment on Participant {
        id        
        username
        distance
        latitude
        longitude
        state
        group {
            id
            name
            distance
            participants {
                username
            }
        }
        event {
            id
            name
            distance
            latitude
            longitude
            state
        }        
    }
`;

export default PARTICIPANT_FRAGMENT;
