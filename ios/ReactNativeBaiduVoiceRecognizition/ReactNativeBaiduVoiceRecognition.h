//
//  ReactNativeBaiduVoiceRecognizition.h
//  ReactNativeBaiduVoiceRecognizition
//
//  Created by leon on 16/7/8.
//  Copyright © 2016年 com.ludafa. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "BDSEventManager.h"

@interface ReactNativeBaiduVoiceRecognition : NSObject <RCTBridgeModule>

@property NSDictionary *options;
@property BDSEventManager *asrEventManager;

@end
