import gql from 'graphql-tag';
import PARTICIPANT_FRAGMENT from './participant.fragment';

const CURRENT_PARTICIPANT_QUERY = gql`
    query currentParticipant {
        currentParticipant {
            ...ParticipantFragment
        }
    }
    ${PARTICIPANT_FRAGMENT}
`;

export default CURRENT_PARTICIPANT_QUERY;
