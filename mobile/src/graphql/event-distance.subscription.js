import gql from 'graphql-tag';

const EVENT_DISTANCE_UPDATED_SUBSCRIPTION = gql`
    subscription onEventDistanceUpdated($event: ID!) {
        eventDistanceUpdated(event: $event) {
            distance
        }
    }
`;

export default EVENT_DISTANCE_UPDATED_SUBSCRIPTION;
