import React from 'react';
import validatejs from 'validate.js';
import { View, Text, StyleSheet, UIManager } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Spinner, FormInput, Hr } from '../components';
import { onSignUp } from '../auth';
import { isBlank } from '../common';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true)

const CONSTRAINTS = {
    email: {
        presence: {
            allowEmpty: false,
            message: '^Please provide an email address'
        },
        email: {
            message: '^Please enter a valid email adress'
        }
    },
    username: {
        presence: {
            allowEmpty: false,
            message: '^Please provide a username'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        },
        length: {
            minimum: 4,
            message: '^Your password must be at least 4 characters'
        }
    },
    confirmationPassword: {
        presence: {
            allowEmpty: false,
            message: '^Please confirm your password'
        },
        equality: {
            attribute: 'password',
            message: '^Passwords must match'
        }
    }
};

const INITIAL_STATE = {
    email: '',
    emailError: null,
    username: '',
    usernameError: null,
    password: '',
    passwordError: null,
    confirmationPassword: '',
    confirmationPasswordError: null,
    canSignUp: false,
    loading: false,
    signUpErrors: []
};

class SignUp extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.signUpFailure = this.signUpFailure.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateConfirmationPassword = this.validateConfirmationPassword.bind(this);
    }

    signIn() {
        this.props.navigation.navigate('SignIn');
    }

    signUp() {
        if (this.state.canSignUp) {
            this.setState(prevState => ({ ...prevState, loading: true }));

            onSignUp(this.state.email, this.state.username, this.state.password)
                .then(() => {
                    this.props.navigation.navigate('SignedIn');
                })
                .catch(err => {
                    this.setState(prevState => ({ ...prevState, loading: false }));
                    this.signUpFailure(err);
                });
        }
    }

    signUpFailure(error) {
        const signUpErrors = [];

        if (error && error.graphQLErrors) {
            signUpErrors.push(error.graphQLErrors.map(({ message }) => message));
        }
        if (error && error.networkError) {
            signUpErrors.push(error.networkError.message);
        }

        this.setState({ ...INITIAL_STATE, signUpErrors });
    }

    handleInputChange(field, value) {
        this.setState(prevState => ({ ...prevState, [field]: value.trim() }));
    }

    validateFields() {
        const errors = validatejs.validate({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmationPassword: this.state.confirmationPassword
        }, CONSTRAINTS);

        const hasErrors = errors !== undefined &&
            (!!errors.email || !!errors.username || !!errors.password || !!errors.confirmationPassword);
        this.setState(prevState => ({ ...prevState, signUpErrors: [], canSignUp: !hasErrors }));

        return errors;
    }

    validateEmail() {
        const errors = this.validateFields();
        const emailError = errors && errors.email ? errors.email[0] : null;
        this.setState(prevState => ({ ...prevState, emailError }));
    }

    validateUsername() {
        const errors = this.validateFields();
        const usernameError = errors && errors.username ? errors.username[0] : null;
        this.setState(prevState => ({ ...prevState, usernameError }));
    }

    validatePassword() {
        const errors = this.validateFields();
        const passwordError = errors && errors.password ? errors.password[0] : null;
        if (isBlank(this.state.confirmationPassword)) {
            this.setState(prevState => ({ ...prevState, passwordError }));
        } else {
            const confirmationPasswordError = errors && errors.confirmationPassword ? errors.confirmationPassword[0] : null;
            this.setState(prevState => ({ ...prevState, passwordError, confirmationPasswordError }));
        }
    }

    validateConfirmationPassword() {
        const errors = this.validateFields();
        const confirmationPasswordError = errors && errors.confirmationPassword ? errors.confirmationPassword[0] : null;
        this.setState(prevState => ({ ...prevState, confirmationPasswordError }));
    }

    render() {
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
                    text='Register'
                    textStyle={{color: 'white', fontSize: 20}}
                    lineStyle={{backgroundColor: 'white', height: StyleSheet.hairlineWidth }}
                />
                <View style={styles.formContainer}>
                    {this.state.signUpErrors.map((error, i) => <Text style={styles.error} key={i}>{error}</Text>)}
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
                            this.validateEmail() || this.emailInput.shake();
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
                            //this.signUp();
                        }}
                    />
                    <Button
                        clear
                        loading={this.state.loading}
                        title='Register'
                        activeOpacity={1}
                        underlayColor='transparent'
                        containerStyle={{ width: '100%' }}
                        loadingProps={{size: 'small', color: 'white'}}
                        buttonStyle={this.state.loading || !this.state.canSignUp ? styles.signUpButtonDisabled : styles.signUpButton}
                        titleStyle={styles.signUpButtonText}
                        onPress={this.signUp}
                        disabled={this.state.loading || !this.state.canSignUp}
                    />
                </View>
                <View style={styles.footerContainer}>
                    <Text style={{color: '#ddd'}}>
                        Already have an account ?
                    </Text>
                    <Button
                        title="Login"
                        clear
                        activeOpacity={0.5}
                        titleStyle={styles.signInButtonText}
                        onPress={this.signIn}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

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
    signUpButtonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    signUpButton: {
        height: 45,
        backgroundColor: '#80d050',
        borderWidth: 2,
        borderColor: '#80d050',
        borderRadius: 30,
        marginTop: 20
    },
    signUpButtonDisabled: {
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        marginTop: 20
    },
    signInButtonText: {
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

export default SignUp;
