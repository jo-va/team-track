import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Body, Text } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Spinner from '../components/spinner';
import Distance from '../components/distance';
import { logout } from '../actions/auth.actions';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';
import ParticipantPropTypes from '../graphql/participant.types';
import {
    startTracking,
    stopTracking
} from '../actions/tracking.actions';

class Main extends React.Component {  
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(startTracking());
    }

    componentWillUnmount() {
        this.props.dispatch(stopTracking());
    }

    logout() {
        this.props.dispatch(logout());
    }

    render() {
        const { loading, participant, tracking } = this.props;

        if (loading || !participant) {
            return (
                <Container>
                    <Spinner />
                </Container>
            );
        }

        return (
            <Container>             
                 <Grid>
                    <Row size={1}>
                        <Distance distance={participant.distance} />
                        <Distance distance={participant.group.distance} />
                        <Distance distance={participant.group.event.distance} />
                    </Row>                 
                    <Row size={1}>
                        <Button>
                            <Text>Tracking</Text>
                        </Button>
                        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>Latitude: {tracking.position.latitude}</Text>
                            <Text>Longitude: {tracking.position.longitude}</Text>
                            <Text>Accuracy: {tracking.position.accuracy}</Text>
                            <Text>Speed: {tracking.position.speed}</Text>
                            <Text>Heading: {tracking.position.heading}</Text>
                            {tracking.error ? <Text>Error: {tracking.error}</Text> : null}
                        </View>
                    </Row>
                </Grid>
            </Container>
        );
    }
}

Main.propTypes = {
    auth: PropTypes.shape({
        loading: PropTypes.bool,
        jwt: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    navigation: PropTypes.shape({
        navigate: PropTypes.func
    }),
    participant: ParticipantPropTypes
};

const currentParticipantQuery = graphql(CURRENT_PARTICIPANT_QUERY, {
    skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
    options: ownProps => ({ fetchPolicy: 'cache-only' }),
    props: ({ data: { loading, currentParticipant } }) => ({
        loading,
        participant: currentParticipant
    })
});

const mapStateToProps = ({ auth, tracking }) => ({
    auth,
    tracking
});

export default compose(
    connect(mapStateToProps),
    currentParticipantQuery
)(Main);