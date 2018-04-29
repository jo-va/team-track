import React from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Animated } from 'react-native';
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
        backgroundColor: theme.mainColor
    },
    buttonPressed: {
        backgroundColor: theme.secondaryColor
    },
    icon: {
        fontSize: 40,
        color: 'white'
    },
    text: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'normal'
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
            width: 0
        }

        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePressOut = this.handlePressOut.bind(this);
        this.animationComplete = this.animationComplete.bind(this);
        this.getButtonWidthLayout = this.getButtonWidthLayout.bind(this);
        this.getProgressStyles = this.getProgressStyles.bind(this);
    }

    componentWillMount() {
        this.value = 0;
        this.state.pressAction.addListener(v => this.value = v.value);
    }

    componentWillUnmount() {
        this.state.pressAction.removeAllListeners();
        this.state.pressAction.stopAnimation();
    }

    handlePressIn() {
        Animated.timing(this.state.pressAction, {
            duration: ACTION_TIMER,
            toValue: 1
        }).start(this.animationComplete);
    }

    handlePressOut() {
        Animated.timing(this.state.pressAction, {
            duration: 200,
            toValue: 0
        }).start();
    }

    animationComplete() {
        if (this.value === 1) {
            this.props.onPress();
        }
    }

    getButtonWidthLayout(e) {
        this.setState({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
    }

    getProgressStyles() {
        const width = this.state.pressAction.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.width]
        });

        return {
            width,
            //height: this.state.height,
            //backgroundColor: this.props.pressed ? theme.mainColor : theme.secondaryColor
        };
    }

    render() {
        const { pressed, style} = this.props;

        return (
            <View style={[styles.container, style && style.container]}>
                <TouchableHighlight
                    underlayColor={(pressed ? theme.secondaryColor : theme.mainColor) + 'dd'}
                    onPressIn={this.handlePressIn}
                    onPressOut={this.handlePressOut}
                    style={[styles.button, pressed && styles.buttonPressed, style && style.button]}
                >
                    <View style={styles.container} onLayout={this.getButtonWidthLayout}>
                        <Animated.View style={[styles.bgFill, this.getProgressStyles()]} />
                        <Text style={styles.text}>{pressed ? 'Hold to stop/pause' : 'Hold to start'}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default PlayToggle;