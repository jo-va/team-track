import gql from 'graphql-tag';

const START_TRACKING_MUTATION = gql`
    mutation startTracking {
        startTracking {
            distance
            isActive
        }
    }
`;

export default START_TRACKING_MUTATION;
