//
//  ReactNativeBaiduVoiceRecognizition.m
//  ReactNativeBaiduVoiceRecognizition
//
//  Created by leon on 16/7/8.
//  Copyright © 2016年 com.ludafa. All rights reserved.
//

#import "RCTEventDispatcher.h"
#import "ReactNativeBaiduVoiceRecognition.h"

#import "BDSEventManager.h"
#import "BDSASRParameters.h"
#import "BDSASRDefines.h"

NSString *jsEventName = @"ReactNativeBaiduVoiceRecognition";

@implementation ReactNativeBaiduVoiceRecognition

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(startRecognition:(NSString*)apiKey
                  secretKey:(NSString*)secretKey)
{

    self.asrEventManager = [BDSEventManager createEventManagerWithName:BDS_ASR_NAME];
    
    [self.asrEventManager setDelegate:self];
    [self.asrEventManager setParameter:@[apiKey, secretKey] forKey:BDS_ASR_API_SECRET_KEYS];
    [self.asrEventManager setParameter:nil forKey:BDS_ASR_AUDIO_FILE_PATH];
    [self.asrEventManager setParameter:nil forKey:BDS_ASR_AUDIO_INPUT_STREAM];
    [self.asrEventManager setParameter:@(NO) forKey:BDS_ASR_DISABLE_AUDIO_OPERATION];
    [self.asrEventManager sendCommand:BDS_ASR_CMD_START];

}

RCT_EXPORT_METHOD(finishRecognition) {

    if (self.asrEventManager) {
        [self.asrEventManager sendCommand:BDS_ASR_CMD_STOP];
    }

}

RCT_EXPORT_METHOD(cancelRecognition) {
    
    if (self.asrEventManager) {
        [self.asrEventManager sendCommand:BDS_ASR_CMD_CANCEL];
    }
    
}

- (void)VoiceRecognitionClientWorkStatus:(int)workStatus obj:(id)aObj

{
    // 抛弃新录音这个事件，其他事件回调给 js
    switch (workStatus) {
        case EVoiceRecognitionClientWorkStatusNewRecordData:
            break;
        case EVoiceRecognitionClientWorkStatusMeterLevel:
        case EVoiceRecognitionClientWorkStatusStartWorkIng:
        case EVoiceRecognitionClientWorkStatusStart:
        case EVoiceRecognitionClientWorkStatusEnd:
        case EVoiceRecognitionClientWorkStatusFlushData:
        case EVoiceRecognitionClientWorkStatusFinish:
        case EVoiceRecognitionClientWorkStatusCancel:
        case EVoiceRecognitionClientWorkStatusError:
        case EVoiceRecognitionClientWorkStatusLoaded:
        case EVoiceRecognitionClientWorkStatusUnLoaded:
        default: {

            NSString *data = [self getDescriptionForDic:aObj];
            NSDictionary *body = @{
                                  @"status": [NSNumber numberWithInt:workStatus],
                                  @"data": data};

            [self.bridge.eventDispatcher sendAppEventWithName:jsEventName
                                                         body:body];
            break;
        }

    }

}

- (NSString *)getDescriptionForDic:(id)obj
{

    if ([obj isKindOfClass:[NSDictionary class]]) {
        NSData *data = [NSJSONSerialization dataWithJSONObject:obj
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:nil];
        return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    }
    
    if ([obj isKindOfClass:[NSNumber class]]) {
        return obj;
    }
    
    if ([obj isKindOfClass:[NSError class]]) {
        return [obj localizedDescription];
    }
    

    return [NSNull null];
}

- (NSDictionary *)constantsToExport
{

    return @{
             
             
            // 回调事件名
            @"VoiceRecognitionEventName": @"ReactNativeBaiduVoiceRecognition",
             
            // 识别相关的工作状态
            // 识别工作开始，开始采集及处理数据
            @"EVoiceRecognitionClientWorkStatusStartWorkIng": @(EVoiceRecognitionClientWorkStatusStartWorkIng),
            // 检测到用户开始说话
            @"EVoiceRecognitionClientWorkStatusStart": @(EVoiceRecognitionClientWorkStatusStart),
            // 本地声音采集结束结束，等待识别结果返回并结束录音
            @"EVoiceRecognitionClientWorkStatusEnd": @(EVoiceRecognitionClientWorkStatusEnd),
            // 录音数据回调
            @"EVoiceRecognitionClientWorkStatusNewRecordData": @(EVoiceRecognitionClientWorkStatusNewRecordData),
            // 连续上屏
            @"EVoiceRecognitionClientWorkStatusFlushData": @(EVoiceRecognitionClientWorkStatusFlushData),
            // 语音识别功能完成，服务器返回正确结果
            @"EVoiceRecognitionClientWorkStatusFinish": @(EVoiceRecognitionClientWorkStatusFinish),
            // 当前音量回调
            @"EVoiceRecognitionClientWorkStatusMeterLevel": @(EVoiceRecognitionClientWorkStatusMeterLevel),
            // 用户取消
            @"EVoiceRecognitionClientWorkStatusCancel": @(EVoiceRecognitionClientWorkStatusCancel),
            // 发生错误，详情见VoiceRecognitionClientErrorInfo接口通知
            @"EVoiceRecognitionClientWorkStatusError": @(EVoiceRecognitionClientWorkStatusError),

            // 离线引擎状态
            // 离线引擎加载完成
            @"EVoiceRecognitionClientWorkStatusLoaded": @(EVoiceRecognitionClientWorkStatusLoaded),
            // 离线引擎卸载完成
            @"EVoiceRecognitionClientWorkStatusUnLoaded": @(EVoiceRecognitionClientWorkStatusUnLoaded)

             };

}

@end
