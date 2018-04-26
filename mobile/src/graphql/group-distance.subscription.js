import gql from 'graphql-tag';

const GROUP_DISTANCE_UPDATED_SUBSCRIPTION = gql`
    subscription onGroupDistanceUpdated($group: ID!) {
        groupDistanceUpdated(group: $group) {
            distance
        }
    }
`;

export default GROUP_DISTANCE_UPDATED_SUBSCRIPTION;
