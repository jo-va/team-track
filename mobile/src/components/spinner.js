import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const Spinner = ({ size, color }) => {
    return (
        <View style={styles.spinner}>
            <ActivityIndicator size={size || 'large'} color={color || theme.mainColor} />
        </View>
    );
};

export default Spinner;
