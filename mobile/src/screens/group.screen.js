import React from 'react';
import { Text } from 'react-native';
import { wsClient } from '../app';
import PARTICIPANT_JOINED_SUBSCRIPTION from '../graphql/participant-joined.subscription';

class Group extends React.Component {
    render() {
        return <Text>Group</Text>;
    }
};

export default Group;
