import gql from 'graphql-tag';

const STOP_TRACKING_MUTATION = gql`
    mutation stopTracking {
        stopTracking {
            distance
            isActive
        }
    }
`;

export default STOP_TRACKING_MUTATION;
