import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import { logout } from '../actions/auth.actions';
import ME_QUERY from '../graphql/me.query';

import { Spinner } from '../components';

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
        const { loading, user } = this.props;

        if (loading || !user) {
            return <Spinner />;
        }

        return (
            <View style={{ paddingVertical: 20 }}>
                <Card title={'Hello ' + user.username}>
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
                        <Text style={{ color: 'white', fontSize: 28 }}>{user.username}</Text>
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
    user: PropTypes.shape({
        username: PropTypes.string
    })
};

const meQuery = graphql(ME_QUERY, {
    skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
    options: ownProps => ({ fetchPolicy: 'cache-only' }),
    props: ({ data: { loading, me } }) => ({
        loading,
        user: me
    })
});

const mapStateToProps = ({ auth }) => ({
    auth
});

export default compose(
    connect(mapStateToProps),
    meQuery
)(Settings);
