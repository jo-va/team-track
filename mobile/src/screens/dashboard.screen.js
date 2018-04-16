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

// See https://github.com/react-navigation/react-navigation/issues/253
// for header centering problems
navigationOptions = ({ navigation }) => ({
    title: applyLetterSpacing('TEAM TRACKER'),
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

class Dashboard extends React.Component {  
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.stopTracking();
        this.props.dispatch(logout());
    }

    render() {
        const { loading, participant, toggleTracking } = this.props;

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

Dashboard.propTypes = {
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

const DashboardWithTracking = hasTracking(compose(
    connect(mapStateToProps),
    currentParticipantQuery
)(Dashboard));

DashboardWithTracking.navigationOptions = navigationOptions;

export default DashboardWithTracking;
