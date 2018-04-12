import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import { onSignOut, getUserToken } from '../services/auth';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null
        };
    }

    componentWillMount() {
        getUserToken().then(user => {
            if (user && user.username) {
                this.setState(prevState => ({ ...prevState, username: user.username }));
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
                        onPress={() => onSignOut().then(() => Actions.reset('auth'))}
                    />
                </Card>
            </View>
        );
    }
}

export default Profile;
