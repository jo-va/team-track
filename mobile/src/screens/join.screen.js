import React from 'react';
import validatejs from 'validate.js';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import FormInput from '../components/form-input';
import { setCurrentParticipant } from '../actions/auth.actions';
import JOIN_MUTATION from '../graphql/join.mutation';
import { applyLetterSpacing } from '../utils';
import theme from '../theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.mainColor,
        padding: 20
    },    
    headerContainer: {
        alignItems: 'center',
        padding: 20
    },
    formContainer: {
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    headerIcon: {
        padding: 10
    },
    headerTitle: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'normal',
        marginVertical: 20
    },
    headerDescription: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'normal',
        marginVertical: 10
    },
    joinButtonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    joinButton: {
        height: 45,
        backgroundColor: '#80d050',
        borderWidth: 2,
        borderColor: '#80d050',
        borderRadius: 30,
        marginTop: 20
    },
    joinButtonDisabled: {
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        marginTop: 20
    },
    error: {
        fontSize: 15,
        color: theme.errorColor,
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export const CONSTRAINTS = {
    username: {
        presence: {
            allowEmpty: false,
            message: '^Please provide a username'
        }
    },
    secret: {
        presence: {
            allowEmpty: false,
            message: '^Cannot be blank'
        }
    }
};

const INITIAL_STATE = {
    username: '',
    usernameError: null,
    secret: '',
    secretError: null,
    canJoin: false,
    loading: false,
    joinErrors: []
};

class Join extends React.Component {
    static navigationOptions = {
        header: null
      };

    constructor(props) {
        super(props);

        if (props.auth && props.auth.jwt) {
            props.navigation.goBack();
        }

        this.state = { ...INITIAL_STATE };

        this.join = this.join.bind(this);
        this.joinFailure = this.joinFailure.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validateSecret = this.validateSecret.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.jwt) {
            nextProps.navigation.goBack();
        }
    }

    join() {
        if (this.state.canJoin) {
            this.setState({ loading: true });

            const { username, secret } = this.state;

            this.props.join(username, secret)
                .then(({ data: { join: participant } }) => {
                    this.props.dispatch(setCurrentParticipant(participant));
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.joinFailure(error);
                });
        }
    }

    joinFailure(error) {
        const joinErrors = [];

        if (error && error.graphQLErrors) {
            joinErrors.push(error.graphQLErrors.map(({ message }) => message));
        }
        if (error && error.networkError) {
            joinErrors.push(error.networkError.message);
        }

        this.setState({ ...INITIAL_STATE, joinErrors });
    }

    handleInputChange(field, value) {
        this.setState({ [field]: value.trim() });
    }

    validateFields() {
        const errors = validatejs.validate({
            username: this.state.username,
            secret: this.state.secret
        }, CONSTRAINTS);

        const hasErrors = errors !== undefined && (!!errors.username || !!errors.secret);
        this.setState({ joinErrors: [], canJoin: !hasErrors });

        return errors;
    }

    validateUsername() {
        const errors = this.validateFields();
        const usernameError = errors && errors.username ? errors.username[0] : null;
        this.setState({ usernameError });
    }

    validateSecret() {
        const errors = this.validateFields();
        const secretError = errors && errors.secret ? errors.secret[0] : null;
        this.setState({ secretError });
    }

    render() {
        const { loading, canJoin } = this.state;
        const disabled = loading || !canJoin || !!this.props.auth.jwt;

        return (
            <KeyboardAwareScrollView
                scrollEnabled={true}
                contentContainerStyle={styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                enableOnAndroid={true}
            >
                <View style={styles.headerContainer}>
                    <Icon style={styles.headerIcon} name='location-pin' color='#ffcd13' size={40} />
                    <Text style={styles.headerTitle}>{applyLetterSpacing('TEAM TRACKER', 2)}</Text>
                    <Text style={styles.headerDescription}>Choose a username and enter your team's password to join and start the tracking</Text>
                </View>
                {this.state.joinErrors.map((error, i) => <Text style={styles.error} key={i}>{error}</Text>)}
                <View style={styles.formContainer}>
                    <FormInput
                        refInput={input => (this.usernameInput = input)}
                        icon='user'
                        placeholder='Username'
                        returnKeyType='next'
                        value={this.state.username}
                        errorMessage={this.state.usernameError}
                        onChangeText={value => this.handleInputChange('username', value)}
                        onBlur={this.validateUsername}
                        onSubmitEditing={() => {
                            this.validateUsername();
                            this.secretInput.focus();
                        }}
                    />
                    <FormInput
                        refInput={input => (this.secretInput = input)}
                        icon='lock'          
                        placeholder='Group Password'
                        secureTextEntry={true}
                        returnKeyType='done'
                        value={this.state.secret}
                        errorMessage={this.state.secretError}
                        onChangeText={value => this.handleInputChange('secret', value)}
                        onBlur={this.validateSecret}
                        blurOnSubmit={true}
                        onSubmitEditing={() => {
                            this.validateSecret();
                        }}
                    />
                    <Button
                        clear
                        loading={loading}
                        title='Join'
                        activeOpacity={1}
                        underlayColor='transparent'
                        containerStyle={{ width: '100%' }}
                        loadingProps={{size: 'small', color: 'white'}}
                        buttonStyle={disabled ? styles.joinButtonDisabled : styles.joinButton}
                        titleStyle={styles.joinButtonText}
                        onPress={this.join}
                        disabled={disabled}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

Join.propTypes = {
    navigation: PropTypes.shape({
        goBack: PropTypes.func,
    }),
    auth: PropTypes.shape({
        loading: PropTypes.bool,
        jwt: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
};

const join = graphql(JOIN_MUTATION, {
    props: ({ mutate }) => ({
        join: (username, secret) =>
            mutate({
                variables: { username, secret }
            })
    })
});

const mapStateToProps = ({ auth }) => ({
    auth
});

export default compose(
    join,
    connect(mapStateToProps)
)(Join);
