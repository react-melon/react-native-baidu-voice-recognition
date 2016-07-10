/**
 * @file BaiduVoiceRecognition
 * @author leon<ludafa@outlook.com>
 */

import {
    NativeModules,
    NativeAppEventEmitter
} from 'react-native';

const Recognition = NativeModules.ReactNativeBaiduVoiceRecognition;

const {
    VoiceRecognitionEventName,
    EVoiceRecognitionClientWorkStatusStartWorkIng,
    EVoiceRecognitionClientWorkStatusStart,
    EVoiceRecognitionClientWorkStatusEnd,
    // EVoiceRecognitionClientWorkStatusNewRecordData,
    EVoiceRecognitionClientWorkStatusFlushData,
    EVoiceRecognitionClientWorkStatusFinish,
    EVoiceRecognitionClientWorkStatusMeterLevel,
    EVoiceRecognitionClientWorkStatusCancel,
    EVoiceRecognitionClientWorkStatusError,
    EVoiceRecognitionClientWorkStatusLoaded,
    EVoiceRecognitionClientWorkStatusUnLoaded
} = Recognition;

export const RecognitionClientWorkStatus = {
    startworking: EVoiceRecognitionClientWorkStatusStartWorkIng,
    start: EVoiceRecognitionClientWorkStatusStart,
    end: EVoiceRecognitionClientWorkStatusEnd,
    // newrecorddata: EVoiceRecognitionClientWorkStatusNewRecordData,
    flushdata: EVoiceRecognitionClientWorkStatusFlushData,
    finish: EVoiceRecognitionClientWorkStatusFinish,
    meterlevel: EVoiceRecognitionClientWorkStatusMeterLevel,
    cancel: EVoiceRecognitionClientWorkStatusCancel,
    error: EVoiceRecognitionClientWorkStatusError,
    loaded: EVoiceRecognitionClientWorkStatusLoaded,
    unloaded: EVoiceRecognitionClientWorkStatusUnLoaded
};

const RECOGNITION_CLIENT_WORK_STATUS_2_HANDLER = {
    [EVoiceRecognitionClientWorkStatusStartWorkIng]: 'onStart',
    [EVoiceRecognitionClientWorkStatusStart]: 'onSpeechStart',
    [EVoiceRecognitionClientWorkStatusEnd]: 'onSpeechEnd',
    // [EVoiceRecognitionClientWorkStatusNewRecordData]: 'onNewRecordData',
    [EVoiceRecognitionClientWorkStatusFlushData]: 'onFlushData',
    [EVoiceRecognitionClientWorkStatusFinish]: 'onFinish',
    [EVoiceRecognitionClientWorkStatusMeterLevel]: 'onMeterLevel',
    [EVoiceRecognitionClientWorkStatusCancel]: 'onCancel',
    [EVoiceRecognitionClientWorkStatusError]: 'onError',
    [EVoiceRecognitionClientWorkStatusLoaded]: 'onLoaded',
    [EVoiceRecognitionClientWorkStatusUnLoaded]: 'onUnloaded'
};

const RECOGNITION_CLIENT_WORK_STATUS_2_NAME = {
    [EVoiceRecognitionClientWorkStatusStartWorkIng]: 'startworking',
    [EVoiceRecognitionClientWorkStatusStart]: 'start',
    [EVoiceRecognitionClientWorkStatusEnd]: 'end',
    // [EVoiceRecognitionClientWorkStatusNewRecordData]: 'newrecorddata',
    [EVoiceRecognitionClientWorkStatusFlushData]: 'flushdata',
    [EVoiceRecognitionClientWorkStatusFinish]: 'finish',
    [EVoiceRecognitionClientWorkStatusMeterLevel]: 'meterlevel',
    [EVoiceRecognitionClientWorkStatusCancel]: 'cancel',
    [EVoiceRecognitionClientWorkStatusError]: 'error',
    [EVoiceRecognitionClientWorkStatusLoaded]: 'loaded',
    [EVoiceRecognitionClientWorkStatusUnLoaded]: 'unloaded'
};

export async function startRecognition(options = {}) {

    const {
        apiKey,
        secretKey,
        onWorkStatusChange
    } = options;

    const subscription = NativeAppEventEmitter.addListener(
        VoiceRecognitionEventName,
        recognitionHandler
    );

    function recognitionHandler(event) {

        let {
            status,
            data
        } = event;

        if (data
            && (
                status === EVoiceRecognitionClientWorkStatusFlushData
                || status === EVoiceRecognitionClientWorkStatusFinish
            )
        ) {

            data = JSON.parse(data);
            data = {
                results: data.results_recognition,
                originResults: data.origin_result
            };

        }

        if (typeof onWorkStatusChange === 'function') {
            onWorkStatusChange({
                data,
                status,
                type: RECOGNITION_CLIENT_WORK_STATUS_2_NAME[status]
            });
        }

        const eventHandlerName = RECOGNITION_CLIENT_WORK_STATUS_2_HANDLER[status];
        const eventHandler = options[eventHandlerName];

        if (typeof eventHandler === 'function') {
            eventHandler(data);
        }

        if (status === EVoiceRecognitionClientWorkStatusFinish
            || status === EVoiceRecognitionClientWorkStatusError
        ) {
            subscription.remove();
        }

    }

    async function cancel() {
        NativeAppEventEmitter.removeListener(recognitionHandler);
        await Recognition.cancelRecognition();
    }

    async function finish() {
        await Recognition.finishRecognition();
    }

    await Recognition.startRecognition(apiKey, secretKey);

    return {
        cancel,
        finish,
        timestamp: Date.now()
    };

}
