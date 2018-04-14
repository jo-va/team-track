import React from 'react';
import validatejs from 'validate.js';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { FormInput, Hr } from '../components';
import { LOGIN_CONSTRAINTS, SIGNUP_CONSTRAINTS } from './signin.constraints';
import { isBlank } from '../utils/string';
import { setCurrentUser } from '../actions/auth.actions';
import LOGIN_MUTATION from '../graphql/login.mutation';
import SIGNUP_MUTATION from '../graphql/signup.mutation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#4a90e2',
        padding: 20
    },
    formContainer: {
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
    },
    inputsContainer: {
        width: '100%'
    },
    footerContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'normal',
        marginVertical: 15
    },
    signinButtonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    signinButton: {
        height: 45,
        backgroundColor: '#80d050',
        borderWidth: 2,
        borderColor: '#80d050',
        borderRadius: 30,
        marginTop: 20
    },
    signinButtonDisabled: {
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        marginTop: 20
    },
    switchButtonText: {
        color: 'orange',
        fontSize: 15,
    },
    error: {
        fontSize: 20,
        color: 'orange',
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

const INITIAL_STATE = {
    view: 'login',
    email: '',
    emailError: null,
    username: '',
    usernameError: null,
    identifier: '',
    identifierError: null,
    password: '',
    passwordError: null,
    loginPassword: '',
    loginPasswordError: null,
    confirmationPassword: '',
    confirmationPasswordError: null,
    canLogin: false,
    canSignup: false,
    loading: false,
    signinErrors: []
};

class Signin extends React.Component {
    static navigationOptions = {
        header: null
      };

    constructor(props) {
        super(props);

        if (props.auth && props.auth.jwt) {
            props.navigation.goBack();
        }

        this.state = { ...INITIAL_STATE };

        this.switchView = this.switchView.bind(this);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.signinFailure = this.signinFailure.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateSignupFields = this.validateSignupFields.bind(this);
        this.validateLoginFields = this.validateLoginFields.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validateIdentifier = this.validateIdentifier.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateLoginPassword = this.validateLoginPassword.bind(this);
        this.validateConfirmationPassword = this.validateConfirmationPassword.bind(this);
        this.renderLoginFields = this.renderLoginFields.bind(this);
        this.renderSignupFields = this.renderSignupFields.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.jwt) {
            nextProps.navigation.goBack();
        }
    }

    switchView() {
        this.setState(prevState => ({
            view: prevState.view === 'signup' ? 'login' : 'signup'
        }));
    }

    login() {
        if (this.state.canLogin) {
            this.setState({ loading: true });

            const { identifier, loginPassword } = this.state;

            this.props.login(identifier, loginPassword)
                .then(({ data: { login: user } }) => {
                    this.props.dispatch(setCurrentUser(user));
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.signinFailure(error);
                });
        }
    }

    signup() {
        if (this.state.canSignup) {
            this.setState({ loading: true });

            const { username, email, password } = this.state;

            this.props.signup(username, email, password)
                .then(({ data: { signup: user } }) => {
                    this.props.dispatch(setCurrentUser(user));
                    this.setState({ loading: false });
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.signinFailure(error);
                });
        }
    }

    signinFailure(error) {
        const signinErrors = [];

        if (error && error.graphQLErrors) {
            signinErrors.push(error.graphQLErrors.map(({ message }) => message));
        }
        if (error && error.networkError) {
            signinErrors.push(error.networkError.message);
        }

        this.setState({ ...INITIAL_STATE, signinErrors });
    }

    handleInputChange(field, value) {
        this.setState({ [field]: value.trim() });
    }

    validateSignupFields() {
        const errors = validatejs.validate({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmationPassword: this.state.confirmationPassword
        }, SIGNUP_CONSTRAINTS);

        const hasErrors = errors !== undefined &&
            (!!errors.email || !!errors.username || !!errors.password || !!errors.confirmationPassword);
        this.setState({ signinErrors: [], canSignup: !hasErrors });

        return errors;
    }

    validateLoginFields() {
        const errors = validatejs.validate({
            identifier: this.state.identifier,
            password: this.state.loginPassword
        }, LOGIN_CONSTRAINTS);

        const hasErrors = errors !== undefined && (!!errors.identifier || !!errors.password);
        this.setState({ signinErrors: [], canLogin: !hasErrors });

        return errors;
    }    

    validateEmail() {
        const errors = this.validateSignupFields();
        const emailError = errors && errors.email ? errors.email[0] : null;
        this.setState({ emailError });
    }

    validateUsername() {
        const errors = this.validateSignupFields();
        const usernameError = errors && errors.username ? errors.username[0] : null;
        this.setState({ usernameError });
    }

    validatePassword() {
        const errors = this.validateSignupFields();
        const passwordError = errors && errors.password ? errors.password[0] : null;
        if (isBlank(this.state.confirmationPassword)) {
            this.setState({ passwordError });
        } else {
            const confirmationPasswordError = errors && errors.confirmationPassword ? errors.confirmationPassword[0] : null;
            this.setState({ passwordError, confirmationPasswordError });
        }
    }

    validateConfirmationPassword() {
        const errors = this.validateSignupFields();
        const confirmationPasswordError = errors && errors.confirmationPassword ? errors.confirmationPassword[0] : null;
        this.setState({ confirmationPasswordError });
    }

    validateIdentifier() {
        const errors = this.validateLoginFields();
        const identifierError = errors && errors.identifier ? errors.identifier[0] : null;
        this.setState({ identifierError });
    }

    validateLoginPassword() {
        const errors = this.validateLoginFields();
        const loginPasswordError = errors && errors.password ? errors.password[0] : null;
        this.setState({ loginPasswordError });
    }

    renderSignupFields() {
        return (
            <View style={styles.inputsContainer}>
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
                        this.emailInput.focus();
                    }}
                />
                <FormInput
                    refInput={input => (this.emailInput = input)}
                    icon='envelope'
                    placeholder='Email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    value={this.state.email}
                    errorMessage={this.state.emailError}
                    onChangeText={value => this.handleInputChange('email', value)}
                    onBlur={this.validateEmail}
                    onSubmitEditing={() => {
                        this.validateEmail();
                        this.passwordInput.focus();
                    }}
                />                                 
                <FormInput
                    refInput={input => (this.passwordInput = input)}
                    icon='lock'          
                    placeholder='Password'
                    secureTextEntry={true}
                    returnKeyType='next'
                    value={this.state.password}
                    errorMessage={this.state.passwordError}
                    onChangeText={value => this.handleInputChange('password', value)}
                    onBlur={this.validatePassword}
                    onSubmitEditing={() => {
                        this.validatePassword();
                        this.confirmationPasswordInput.focus();
                    }}
                />
                <FormInput
                    refInput={input => (this.confirmationPasswordInput = input)}
                    icon='lock'   
                    placeholder='Confirm Password'
                    secureTextEntry={true}
                    returnKeyType='done'
                    value={this.state.confirmationPassword}
                    errorMessage={this.state.confirmationPasswordError}
                    onChangeText={value => this.handleInputChange('confirmationPassword', value)}
                    onBlur={this.validateConfirmationPassword}
                    onSubmitEditing={() => {
                        this.validateConfirmationPassword();
                    }}
                />
            </View>
        );
    }

    renderLoginFields() {
        return (
            <View style={styles.inputsContainer}>
                <FormInput
                    refInput={input => (this.identifierInput = input)}
                    icon='user'
                    placeholder='Email or Username'
                    returnKeyType='next'
                    value={this.state.identifier}
                    errorMessage={this.state.identifierError}
                    onChangeText={value => this.handleInputChange('identifier', value)}
                    onBlur={this.validateIdentifier}
                    onSubmitEditing={() => {
                        this.validateIdentifier();
                        this.loginPasswordInput.focus();
                    }}
                />                              
                <FormInput
                    refInput={input => (this.loginPasswordInput = input)}
                    icon='lock'          
                    placeholder='Password'
                    secureTextEntry={true}
                    returnKeyType='done'
                    value={this.state.loginPassword}
                    errorMessage={this.state.loginPasswordError}
                    onChangeText={value => this.handleInputChange('loginPassword', value)}
                    onBlur={this.validateLoginPassword}
                    onSubmitEditing={() => {
                        this.validateLoginPassword();
                    }}
                />
            </View>
        );
    }

    render() {
        const { loading, view, canLogin, canSignup } = this.state;
        const canSignin = view === 'signup' ? canSignup : canLogin;
        const disabled = loading || !canSignin || !!this.props.auth.jwt;

        return (
            <KeyboardAwareScrollView
                scrollEnabled={true}
                contentContainerStyle={styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                enableOnAndroid={false}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.headerText, { marginRight: 10 }]}>GROUP TRACKER</Text>
                    <Icon name='location-pin' color='orange' size={30} />
                </View>
                <Hr
                    text={view === 'signup' ? 'Sign up' : 'Login'}
                    textStyle={{color: 'white', fontSize: 20}}
                    lineStyle={{backgroundColor: 'white', height: StyleSheet.hairlineWidth }}
                />
                <View style={styles.formContainer}>
                    {this.state.signinErrors.map((error, i) => <Text style={styles.error} key={i}>{error}</Text>)}
                    {view === 'signup' ? this.renderSignupFields() : this.renderLoginFields() }
                    <Button
                        clear
                        loading={loading}
                        title={view === 'signup' ? 'Sign up' : 'Login'}
                        activeOpacity={1}
                        underlayColor='transparent'
                        containerStyle={{ width: '100%' }}
                        loadingProps={{size: 'small', color: 'white'}}
                        buttonStyle={disabled ? styles.signinButtonDisabled : styles.signinButton}
                        titleStyle={styles.signinButtonText}
                        onPress={this[view]}
                        disabled={disabled}
                    />
                </View>
                <View style={styles.footerContainer}>
                    <Text style={{color: '#ddd'}}>
                        { view === 'signup' ? 'Already have an account?' : 'New to Group Tracker?' }
                    </Text>
                    <Button
                        title={view === 'login' ? 'Sign up' : 'Login'}
                        clear
                        activeOpacity={0.5}
                        titleStyle={styles.switchButtonText}
                        buttonStyle={{marginLeft: 10}}
                        onPress={this.switchView}
                    />                    
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

Signin.propTypes = {
    navigation: PropTypes.shape({
        goBack: PropTypes.func,
    }),
    auth: PropTypes.shape({
        loading: PropTypes.bool,
        jwt: PropTypes.string
    }),
    dispatch: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired
};

const login = graphql(LOGIN_MUTATION, {
    props: ({ mutate }) => ({
        login: (identifier, password) =>
            mutate({
                variables: { emailOrUsername: identifier, password }
            })
    })
});

const signup = graphql(SIGNUP_MUTATION, {
    props: ({ mutate }) => ({
        signup: (username, email, password) =>
            mutate({
                variables: { username, email, password }
            })
    })
});

const mapStateToProps = ({ auth }) => ({
    auth
});

export default compose(
    login,
    signup,
    connect(mapStateToProps)
)(Signin);
