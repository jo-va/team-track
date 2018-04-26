import gql from 'graphql-tag';
import PARTICIPANT_FRAGMENT from './participant.fragment';

const PARTICIPANT_JOINED_SUBSCRIPTION = gql`
    subscription onParticipantJoined($group: ID!) {
        participantJoined(group: $group) {
            ...ParticipantFragment
        }
    }
    ${PARTICIPANT_FRAGMENT}
`;

export default PARTICIPANT_JOINED_SUBSCRIPTION;
