import React from 'react';
import { connect } from 'react-redux';
import { Container, Text } from 'native-base';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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
            position: {
                latitude: 45.391607,
                longitude: -71.896346,
            },
            region: {
                latitude: 45.391607,
                longitude: -71.896346,
                latitudeDelta: 0.0922/4,
                longitudeDelta: 0.0421/4,
            }
        };
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tracking.position !== nextProps.tracking.position) {
            const { position: { latitude, longitude } } = nextProps.tracking;
            this.setState({ position: { latitude, longitude }});
        }
    }
      
    render() {
        return (
            <Container>
                <MapView
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}
                    style={styles.map}
                >
                    <Marker
                        ref={marker => {this.marker = marker }}
                        coordinate={this.state.position}
                    />
                </MapView>
            </Container>
        );
    }
};

const mapStateToProps = ({ tracking }) => ({
    tracking
});

export default connect(mapStateToProps)(Map);
