import React from 'react';
import { Container, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();

        this.onRegionChange = this.onRegionChange.bind(this);
    }

    getInitialState() {
        return {
            region: {
                latitude: 45.391607,
                longitude: -71.896346,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }
      
    onRegionChange(region) {
        this.setState({ region });
    }
      
    render() {
        return (
            <Container>
                <MapView
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}
                >
                </MapView>
            </Container>
        );
    }
};

export default Map;
