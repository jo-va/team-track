import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Spinner } from '../components';
import { logout } from '../actions/auth.actions';
import CURRENT_PARTICIPANT_QUERY from '../graphql/current-participant.query';
import ParticipantPropTypes from '../graphql/participant.prop-types';

class Settings extends React.Component {
    static navigationOptions = {
        title: 'Settings'
    };

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        console.log(this.props);
        this.props.dispatch(logout());
    }

    render() {
        const { loading, participant } = this.props;

        if (loading || !participant) {
            return <Spinner />;
        }

        return (
            <View style={{ paddingVertical: 20 }}>
                <Card title={'Hello ' + participant.username}>
                    <View
                        style={{
                            backgroundColor: '#bcbec1',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            alignSelf: 'center',
                            marginBottom: 20
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 28 }}>{participant.username}</Text>
                    </View>
                    <Button
                        backgroundColor='#03A9F4'
                        title='Logout'
                        onPress={this.logout}
                    />
                </Card>
            </View>
        )
    }
}

Settings.propTypes = {
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
)(Settings);
