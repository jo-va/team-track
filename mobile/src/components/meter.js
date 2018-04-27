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
        fontSize: 45,
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
    const { value, title, label, style } = props;

    const containerStyle = style ? style.container : null;
    const titleStyle = style ? style.title : null;
    const labelStyle = style ? style.label : null;
    const valueStyle = style ? style.value : null;

    return (
        <View style={[styles.container, containerStyle]}>
            {!isBlank(title) && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            <Text style={[styles.value, valueStyle]}>{value}</Text>
            {!isBlank(label) && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        </View>
    );
};

export default Meter;
