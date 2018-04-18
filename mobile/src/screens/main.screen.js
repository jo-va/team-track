import React from 'react';
import PropTypes from 'prop-types';
import {
    Container,
    Content,
    Header,
    Title,
    Button,
    Icon,
    Right,
    Left,
    Body,
    Text,
    Fab,
    IconNB
} from 'native-base';
import { View, StyleSheet } from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Spinner from '../components/spinner';
import Distance from '../components/distance';
import hasTracking from '../components/has-tracking';
import { logout } from '../actions/auth.actions';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';
import ParticipantPropTypes from '../graphql/participant.types';
import {
    initTracking,
    finalizeTracking,
    startTracking,
    stopTracking,
    toggleTracking
} from '../actions/tracking.actions';

class Main extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            menuFab: false,
            region: {
                latitude: 45.39745520000535,
                longitude: -71.91719054925784,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(initTracking());
    }

    componentWillUnmount() {
        finalizeTracking();
    }

    logout() {
        stopTracking();
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

        /*
        <Header>
            <Left style={{ flex: 1 }} />
            <Body style={{ flex: 1 }}>
                <Title>Dashboard</Title>
            </Body>
            <Right style={{ flex: 1 }} />
        </Header>
        */

        return (
            <Container>
                 <Grid>
                    <Row size={1}>
                        <Distance distance={participant.distance} />
                        <Distance distance={participant.group.distance} />
                        <Distance distance={participant.group.event.distance} />
                    </Row>                 
                    <Row size={1}>
                        <Button onPress={toggleTracking}>
                            <Text>Tracking</Text>
                        </Button>
                    </Row>
                    <View style={{ flex: 1 }}>
                        <Fab
                            active={this.state.menuFab}
                            direction='up'
                            position='bottomRight'
                            containerStyle={{}}
                            style={{ backgroundColor: '#5067ff' }}
                            onPress={() => this.setState({ menuFab: !this.state.menuFab })}
                        >
                            <IconNB name="md-menu" />
                            <Button style={{ backgroundColor: '#DD5144' }} onPress={this.logout}>
                                <IconNB name="md-log-out" />
                            </Button>
                        </Fab>
                    </View>
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