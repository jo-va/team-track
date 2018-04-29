import gql from 'graphql-tag';

const START_TRACKING_MUTATION = gql`
    mutation startTracking {
        startTracking {
            distance
            state
        }
    }
`;

export default START_TRACKING_MUTATION;
