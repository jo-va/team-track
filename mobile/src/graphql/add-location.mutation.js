import gql from 'graphql-tag';

const ADD_LOCATION_MUTATION = gql`
    mutation addLocation($location: LocationInput!) {
        addLocation(location: $location) {
            distance
            isOutOfRange
        }
    }
`;

export default ADD_LOCATION_MUTATION;
