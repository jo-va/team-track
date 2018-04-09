import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import { onSignOut, getAuthToken } from '../auth';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null
        };
    }

    componentWillMount() {
        getAuthToken().then(res => {
            if (res && res.username) {
                this.setState(prevState => ({ ...prevState, username: res.username }));
            }
        });
    }

    render() {
        if (!this.state.username) {
            return null;
        }
        return (
            <View style={{ paddingVertical: 20 }}>
                <Card title={this.state.username}>
                    <View
                        style={{
                            backgroundColor: '#bcbec1',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            alignSelf: 'center',
                            marginBottom: 20
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 28 }}>{this.state.username}</Text>
                    </View>
                    <Button
                        backgroundColor='#03A9F4'
                        title='SIGN OUT'
                        onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}
                    />
                </Card>
            </View>
        );
    }
}

export default Profile;
