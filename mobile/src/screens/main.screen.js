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
/*import {
    initTracking,
    finalizeTracking,
    startTracking,
    stopTracking,
    toggleTracking
} from '../actions/tracking.actions';*/

class Main extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            error: null,
        };

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 0 },
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    logout() {
        this.props.dispatch(logout());
    }

    render() {
        const { loading, participant } = this.props;

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
                            <Text>Latitude: {this.state.latitude}</Text>
                            <Text>Longitude: {this.state.longitude}</Text>
                            {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
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