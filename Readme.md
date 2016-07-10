# ReactNative 百度语音识别 SDK

iOS supported

Android coming soon

## setup

1. 安装依赖

    ```sh
    npm install -S react-native-baidu-voice-recognition
    ```

2. 使用 rnpm 搞定 xcode

    ```sh
    rnpm link react-native-baidu-voice-recognition
    ```


> 在线识别需要网络连接，所以需要在 Info.plist 中打开 SSL 请求限制

## Usage

```js

import {startRecognition} from 'react-native-baidu-voice-recognition';

const recognition = startRecognition({

    // 这两个请到 http://yuyin.baidu.com 上来申请 app 后查看哈
    apiKey: 'YOUR_BAIDU_YUYIN_APP_API_KEY',
    secretKey: 'YOUR_BAIDU_YUYIN_APP_SECERT_KEY',

    // 开始解析
    onStart() {

    },

    // 检测到用户开始说话
    onSpeechStart() {

    },

    // 用户结束说话
    onSpeechEnd() {

    },

    // 解析出部分数据
    // 此回调可能会被调用若干次，每次都会带有前边解析出的数据
    // 例如三次 onFlushData 回调可能分别得到数据：啊，啊啊，啊啊啊
    onFlushData(data) {

        // 数据结构是这样的
        {
            results: ['啊', '哈']
        }

    },

    // 完成解析
    onFinish(data) {
        // 数据结构是这样的
        {
            results: ['啊', '哈']
        }
    },

    // 用户说话音量大小变化
    onMeterLevel() {

    },

    // 主动取消解析
    onCancel() {

    },

    // 解析发生错误
    onError() {

    }

});

setTimeout(function () {

    if (Date.now() - recognition.timestamp > 1000) {

        // 可以主动结束录音
        recognition.finish();

    }
    else {
        // 或者也可以主动
        recognition.cancel();    
    }

}, Math.round(Math.random() * 2000));

```

## TODO

[ ] Android 支持
[ ] 唤醒支持
[ ] 离线版本支持
