import gql from 'graphql-tag';
import PARTICIPANT_FRAGMENT from './participant.fragment';

const PARTICIPANT_JOINED_SUBSCRIPTION = gql`
    subscription onParticipantJoined {
        participantJoined {
            ...ParticipantFragment
        }
    }
    ${PARTICIPANT_FRAGMENT}
`;

export default PARTICIPANT_JOINED_SUBSCRIPTION;
