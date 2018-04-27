import gql from 'graphql-tag';

const MOVE_MUTATION = gql`
    mutation move($latitude: Float, $longitude: Float) {
        move(latitude: $latitude, longitude: $longitude) {
            distance
            state
        }
    }
`;

export default MOVE_MUTATION;
