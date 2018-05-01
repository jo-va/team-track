import React from 'react';
import { connect } from 'react-redux';
import { Container, Text, Button, Header, Title, Left, Body, Right, Icon } from 'native-base';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Spinner from '../components/spinner';

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
});

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            location: {
                latitude: null,
                longitude: null,
            },
            accuracy: null,
            region: {
                latitude: null,
                longitude: null,
                latitudeDelta: 0.0922/4,
                longitudeDelta: 0.0421/4,
            }
        };

        this.onRegionChange = this.onRegionChange.bind(this);
    }

    componentDidMount() {
        this.updateLocation(this.props.tracking.location);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tracking.location !== nextProps.tracking.location) {
            this.updateLocation(nextProps.tracking.location);
        }
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    updateLocation({ latitude, longitude, accuracy }) {
        if (!latitude || !longitude) {
            return;
        }

        if (this.state.loading) {
            this.setState({ region: { ...this.state.region, latitude, longitude } });
        }

        this.setState({
            loading: false,
            location: { latitude, longitude },
            accuracy
        });
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Map</Title>
                    </Body>
                    <Right />
                </Header>
                {
                    this.state.loading ? 
                    <Spinner /> :
                    <MapView
                        initialRegion={this.state.region}
                        onRegionChange={this.onRegionChange}
                        style={styles.map}
                    >
                        <Circle
                            center={this.state.location}
                            radius={this.state.accuracy}
                            fillColor='rgba(255,0,0,0.5)'
                            strokeColor='red'
                        />
                    </MapView>
                }
            </Container>
        );
    }
};

const mapStateToProps = ({ tracking }) => ({
    tracking
});

export default connect(mapStateToProps)(Map);
