import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Animated } from 'react-native';
import { Icon } from 'native-base';
import theme from '../theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0ad4e',
    },
    buttonPressed: {
        backgroundColor: '#2cccd6'
    },
    icon: {
        fontSize: 40,
        color: 'white'
    },
    text: {
        fontSize: 27,
        color: 'white',
        fontWeight: 'bold'
    },
    bgFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 5,
        backgroundColor: '#5cb85c'
    }
});

const ACTION_TIMER = 1500;

class PlayToggle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressAction: new Animated.Value(0),
            complete: false,
            width: 0
        }

        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
        this.animationActionComplete = this.animationActionComplete.bind(this);
        this.getButtonWidthLayout = this.getButtonWidthLayout.bind(this);
        this.getProgressStyles = this.getProgressStyles.bind(this);
    }

    componentWillMount() {
        this.value = 0;
        this.state.pressAction.addListener(v => this.value = v.value);
    }

    componentWillUnmount() {
        this.state.pressAction.removeAllListeners();
    }

    handlePressIn() {
        Animated.timing(this.state.pressAction, {
            duration: ACTION_TIMER,
            toValue: 1
        }).start(this.animationActionComplete);
    }

    handlePressOut() {
        Animated.timing(this.state.pressAction, {
            duration: 200,
            toValue: 0
        }).start();
    }

    animationActionComplete() {
        if (this.value === 1) {
            this.props.onPress();
        }
        this.setState({ complete: this.value === 1 });
    }

    getButtonWidthLayout(e) {
        this.setState({ width: e.nativeEvent.layout.width });
    }

    getProgressStyles() {
        const width = this.state.pressAction.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.width]
        });

        return { width };
    }
    
    render() {
        const { pressed, style} = this.props;

        return (
            <View style={[styles.container, style && style.container]}>
                <TouchableHighlight
                    underlayColor={pressed ? 'rgba(44, 204, 214, 0.5)' : 'rgba(240, 173, 78, 0.5)'}
                    onPressIn={this.handlePressIn}
                    onPressOut={this.handlePressOut}
                    style={[styles.button, pressed && styles.buttonPressed, style && style.button]}
                >
                    <View style={styles.container} onLayout={this.getButtonWidthLayout}>
                        <Animated.View style={[styles.bgFill, this.getProgressStyles()]} />
                        {
                            pressed ?
                            <Icon name='md-pause' style={[styles.icon, style && style.icon]} /> :
                            <Text style={styles.text}>Hold to start</Text>
                        }
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default PlayToggle;