import gql from 'graphql-tag';

const STEP_MUTATION = gql`
    mutation step($location: LocationInput!) {
        step(location: $location) {
            distance
            state
        }
    }
`;

export default STEP_MUTATION;
