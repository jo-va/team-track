import gql from 'graphql-tag';

const PARTICIPANT_FRAGMENT = gql`
    fragment ParticipantFragment on Participant {
        id        
        username
        distance
        state
        group {
            id
            name
            distance
        }
        event {
            id
            name
            distance
            state
        }        
    }
`;

export default PARTICIPANT_FRAGMENT;
