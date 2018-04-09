import React from 'react';
import validatejs from 'validate.js';
import { View, Text, StyleSheet, UIManager } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { Spinner, FormInput, Hr } from '../components';
import { onSignIn } from '../auth';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true)

const CONSTRAINTS = {
    identifier: {
        presence: {
            allowEmpty: false,
            message: '^Please provide a username or email'
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: '^Please enter a password'
        }
    }
};

const INITIAL_STATE = {
    identifier: '',
    identifierError: null,
    password: '',
    passwordError: null,
    canSignIn: false,
    loading: false,
    signInErrors: []
};

class SignIn extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        this.signIn = this.signIn.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateIdentifier = this.validateIdentifier.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateFields = this.validateFields.bind(this);
    }

    signIn() {
        if (this.state.canSignIn) {
            this.setState(prevState => ({ ...prevState, loading: true }));

            onSignIn(this.state.identifier, this.state.password)
                .then(() => {
                    this.props.navigation.navigate('SignedIn');
                })
                .catch(err => {
                    this.setState(prevState => ({ ...prevState, loading: false }));
                    this.signInFailure(err);
                });
        }
    }

    signInFailure(error) {
        const signInErrors = [];

        if (error && error.graphQLErrors) {
            signInErrors.push(error.graphQLErrors.map(({ message }) => message));
        }
        if (error && error.networkError) {
            signInErrors.push(error.networkError.message);
        }

        this.setState({ ...INITIAL_STATE, signInErrors });
    }

    handleInputChange(field, value) {
        this.setState(prevState => ({ ...prevState, [field]: value.trim() }));
    }

    validateFields() {
        const errors = validatejs.validate({
            identifier: this.state.identifier,
            password: this.state.password
        }, CONSTRAINTS);

        const hasErrors = errors !== undefined && (!!errors.identifier || !!errors.password);
        this.setState(prevState => ({ ...prevState, signInErrors: [], canSignIn: !hasErrors }));

        return errors;
    }

    validateIdentifier() {
        const errors = this.validateFields();
        const identifierError = errors && errors.identifier ? errors.identifier[0] : null;
        this.setState(prevState => ({ ...prevState, identifierError }));
    }

    validatePassword() {
        const errors = this.validateFields();
        const passwordError = errors && errors.password ? errors.password[0] : null;
        this.setState(prevState => ({ ...prevState, passwordError }));
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
                    {this.state.signInErrors.map((error, i) => <Text style={styles.error} key={i}>{error}</Text>)}
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
                            this.passwordInput.focus();
                        }}
                    />                              
                    <FormInput
                        refInput={input => (this.passwordInput = input)}
                        icon='lock'          
                        placeholder='Password'
                        secureTextEntry={true}
                        returnKeyType='done'
                        value={this.state.password}
                        errorMessage={this.state.passwordError}
                        onChangeText={value => this.handleInputChange('password', value)}
                        onBlur={this.validatePassword}
                        onSubmitEditing={() => {
                            this.validatePassword();
                            //this.signIn();
                        }}
                    />
                    <Button
                        clear
                        loading={this.state.loading}
                        title='Login'
                        activeOpacity={1}
                        underlayColor='transparent'
                        containerStyle={{ width: '100%' }}
                        loadingProps={{size: 'small', color: 'white'}}
                        buttonStyle={this.state.loading || !this.state.canSignIn ? styles.signInButtonDisabled : styles.signInButton}
                        titleStyle={styles.signInButtonText}
                        onPress={this.signIn}
                        disabled={this.state.loading || !this.state.canSignIn}
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
        justifyContent: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'normal',
        marginVertical: 15
    },
    signInButtonText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    signInButton: {
        height: 45,
        backgroundColor: '#80d050',
        borderWidth: 2,
        borderColor: '#80d050',
        borderRadius: 30,
        marginTop: 20
    },
    signInButtonDisabled: {
        height: 45,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        marginTop: 20
    },
    error: {
        fontSize: 15,
        color: 'orange',
        paddingBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});


export default SignIn;
