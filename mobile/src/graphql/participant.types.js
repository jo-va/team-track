import PropTypes from 'prop-types';

export const ParticipantPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    state: PropTypes.string.isRequired,
    group: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
        participants: PropTypes.arrayOf(
            PropTypes.shape({
                username: PropTypes.string.isRequired
            })
        )
    }),
    event: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        state: PropTypes.string.isRequired
    })
});

export default ParticipantPropTypes;
