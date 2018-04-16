import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import theme from '../theme';

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: 45,
        borderWidth: 0,
        borderColor: 'transparent',
        height: 45,
        marginVertical: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        fontWeight: 'normal',
        fontSize: 15,
    },
    errorInputStyle: {
        marginTop: -5,
        textAlign: 'center',
        color: theme.errorColor,
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export const FormInput = props => {
    const { icon, refInput, ...otherProps } = props;

    return (
        <Input
            ref={refInput}
            leftIcon={<Icon name={icon} color='white' size={18} />}
            selectionColor='white'
            autoFocus={false}
            autoCorrect={false}
            blurOnSubmit={true}
            autoCapitalize='none'
            placeholderTextColor='white'
            containerStyle={{ width: '100%' }}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            errorStyle={styles.errorInputStyle}
            shake={false}
            {...otherProps}
        />
    );
};

export default FormInput;
