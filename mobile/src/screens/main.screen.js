import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Container, Content, Button, Header, Body, Text, Title, Icon } from 'native-base';
import Modal from 'react-native-modal';
import { Grid, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Spinner from '../components/spinner';
import Meter from '../components/meter';
import { logout } from '../actions/auth.actions';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';
import ParticipantPropTypes from '../graphql/participant.types';
import {
    startTracking,
    stopTracking,
    toggleTracking
} from '../actions/tracking.actions';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)'
    }
});

class Main extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            debugModalVisible: false
        };

        this.logout = this.logout.bind(this);
        this.toggleGeolocation = this.toggleGeolocation.bind(this);
    }

    componentWillUnmount() {
        this.props.dispatch(stopTracking());
    }

    logout() {
        this.props.dispatch(logout());
    }

    toggleGeolocation() {
        this.props.dispatch(toggleTracking());
    }

    formatDistance(distance, decimal = 0) {
        return distance.toFixed(decimal);
    }

    setDebugModalVisible(visible) {
        this.setState({ debugModalVisible: visible });
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
        console.log(participant);

        return (
            <Container>
                <Content contentContainerStyle={{flex: 1}}>
                    <View style={styles.container}>
                        <Button
                            onPress={this.toggleGeolocation}
                            large
                            full
                            info={tracking.isTracking}
                            success={!tracking.isTracking}
                        >
                            <Text>{tracking.isTracking ? 'Pause' : 'Start'}</Text>
                        </Button>

                        <Meter
                            value={this.formatDistance(participant.distance, 2)}
                            title={participant.username}
                            label='DISTANCE (km)'
                        />

                        <Meter
                            value={this.formatDistance(participant.group.distance)}
                            title={participant.group.name}
                            label='DISTANCE (km)'
                        />

                        <Meter
                            value={this.formatDistance(participant.event.distance)}
                            title={participant.event.name}
                            label='DISTANCE (km)'
                        />

                        <Button
                            small
                            warning
                            transparent
                            onPress={() => this.setDebugModalVisible(true)}
                            style={{ position: 'absolute', bottom: 10, left: 0 }}>
                            <Icon name='bug' />
                        </Button>

                        <Modal
                            visible={this.state.debugModalVisible}
                            onRequestClose={() => {}}
                        >
                            <View style={styles.modalContent}>
                                <Text>isTracking: {tracking.isTracking ? 'true' : 'false'}</Text>
                                <Text>timestamp: {tracking.position.timestamp}</Text>
                                <Text>Latitude: {tracking.position.latitude}</Text>
                                <Text>Longitude: {tracking.position.longitude}</Text>
                                <Text>Accuracy: {tracking.position.accuracy}</Text>
                                <Text>Speed: {tracking.position.speed}</Text>
                                <Text>Heading: {tracking.position.heading}</Text>
                                {tracking.error ? <Text>Error: {tracking.error}</Text> : null}
                                    
                                <Button onPress={this.logout} style={{marginTop: 10}} full>
                                    <Text>Logout</Text>
                                </Button>

                                <Button onPress={this.toggleGeolocation} style={{marginTop: 10}} full bordered>
                                    <Text>Toggle Tracking</Text>
                                </Button>                                

                                <Button onPress={() => this.setDebugModalVisible(false)} style={{marginTop: 10}} full>
                                    <Text>Close</Text>
                                </Button>                                
                            </View>
                        </Modal>
                    </View>           
                </Content>
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