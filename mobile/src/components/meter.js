import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';
import { isBlank } from '../utils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignSelf: 'stretch',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#d6d7da',
    },
    value: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: '#222'
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    }
});

export const Meter = props => {
    const { value, title, label } = props;

    return (
        <View style={styles.container}>
            {!isBlank(title) && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.value}>{value}</Text>
            {!isBlank(label) && <Text style={styles.label}>{label}</Text>}
        </View>
    );
};

export default Meter;
