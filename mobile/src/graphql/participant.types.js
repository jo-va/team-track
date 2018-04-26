import PropTypes from 'prop-types';

export const ParticipantPropTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    state: PropTypes.string.isRequired,
    group: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
    }),
    event: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
        state: PropTypes.string.isRequired
    })
});

export default ParticipantPropTypes;
