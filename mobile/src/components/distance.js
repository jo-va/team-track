import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 10,
        margin: 5,
        flexDirection: 'row'
    },
    distance: {
        color: 'white',
        fontSize: 30,
        marginRight: 7
    },
    unit: {
        color: '#aaa',
        fontSize: 15
    }
});

export const Distance = props => {
    const { distance } = props;

    const distanceFormatted = distance.toFixed(2);

    return (
        <View style={styles.container}>
            <Text style={styles.distance}>{distanceFormatted}</Text>
            <Text style={styles.unit}>Km</Text>
        </View>        
    );
};

export default Distance;
