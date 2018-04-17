import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Spinner from '../components/spinner';
import Distance from '../components/distance';
import hasTracking from '../components/has-tracking';
import { logout } from '../actions/auth.actions';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';
import ParticipantPropTypes from '../graphql/participant.types';
import { applyLetterSpacing } from '../utils';
import theme from '../theme';
import {
    initTracking,
    finalizeTracking,
    startTracking,
    stopTracking,
    toggleTracking
} from '../actions/tracking.actions';

const styles = StyleSheet.create({
    scroll: {
        padding: 30,
        flexDirection: 'column'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

class Main extends React.Component {  
    // See https://github.com/react-navigation/react-navigation/issues/253
    // for header centering problems
    static navigationOptions = ({ navigation }) => ({
        title: applyLetterSpacing('MAIN'),
        headerStyle: {
            backgroundColor: theme.mainColor,
            borderBottomColor: 'transparent',
            borderWidth: 0,
            elevation: 0,
            shadowOpacity: 0
        },
        headerTitleStyle: {
            color: 'white',
            fontSize: 20,
            fontWeight: 'normal',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1
        },
        headerTintColor: '#fff'
    });

    constructor(props) {
        super(props);
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
            return <Spinner />;
        }

        return (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <Text>{participant.group.event.name}</Text>
                <Text>{participant.group.name}</Text>
                <Distance distance={participant.distance} />
                <Distance distance={participant.group.distance} />
                <Distance distance={participant.group.event.distance} />
                <Button
                    backgroundColor='#03A9F4'
                    title='Enable/Disable Tracking'
                    onPress={toggleTracking}
                />
                <Button
                    backgroundColor='#03A9F4'
                    title='Logout'
                    onPress={this.logout}
                />
            </ScrollView>
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

const mapStateToProps = ({ auth }) => ({
    auth
});

export default compose(
    connect(mapStateToProps),
    currentParticipantQuery
)(Main);