/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import {
    startRecognition
} from 'react-native-baidu-voice-recognition';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textContainer: {
        flex: 1,
        padding: 10,
        marginTop: 20
    },
    text: {
        fontSize: 12,
        lineHeight: 18
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

const API_KEY = 'g8ylHecLtt4WyTuPFG7Fssu0';
const SECRET_KEY = '391b8964cb174efc85eac80b5fcf6be5';

class Example extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recognizing: false,
            content: 'Welcome To ReactNative!',
            buffer: ''
        };
    }

    async startRecognition() {

        const me = this;

        me.setState({
            recording: true
        });

        if (me.recognition) {
            await me.recognition.cancel();
            me.recognition = null;
        }

        me.recognition = await startRecognition({
            apiKey: API_KEY,
            secretKey: SECRET_KEY,
            onStart() {
                console.log('start');
                me.setState({
                    recognizing: true
                });
            },
            onSpeechStart() {
                console.log('speech-start');
            },
            onFlushData(data) {
                me.setState({
                    buffer: data.results[0]
                });
            },
            onCancel() {
                me.recognition = null;
                me.setState({
                    recognizing: false,
                    buffer: ''
                });
            },
            onError(error) {
                console.log(error);
                me.recognition = null;
                me.setState({
                    recording: false,
                    recognizing: false,
                    buffer: ''
                });
            },
            onFinish(data) {
                console.log('finish');
                me.recognition = null;
                me.setState({
                    recording: false,
                    recognizing: false,
                    content: `${me.state.content}\n${data.results[0]}`,
                    buffer: ''
                });
            }
        });

    }

    async finishRecognition() {

        if (!this.recognition) {
            return;
        }

        if (Date.now() - this.recognition.timestamp > 1000) {
            if (this.state.recording) {
                this.setState({
                    recording: false
                });
            }
            await this.recognition.finish();
        }
        else {
            await this.recognition.cancel();
        }

    }

    render() {

        const {
            content,
            buffer,
            recording,
            recognizing
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {`${content}${buffer ? '\n' + buffer : ''}`}
                    </Text>
                </View>
                <TouchableHighlight
                    style={{
                        flex: 0,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#009f93'
                    }}
                    onPressIn={() => {
                        this.startRecognition();
                    }}
                    onPressOut={() => {
                        this.finishRecognition();
                    }}
                    underlayColor="#008075">
                    <View>
                        <Text style={{color: '#fff'}}>
                            {recording
                                ? '录音中...'
                                : recognizing ? '解析中...' : 'Start Voice Recognition'}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}



AppRegistry.registerComponent('Example', () => Example);
