/**
 * @format
 */

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import configureStore from './src/redux/store';
import {Provider} from "react-redux";
import React from "react";
import Main from "./src/screens/Main";
import PushNotification from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

const store = configureStore();

const MainApplication = () => {
    messaging().setBackgroundMessageHandler(message => {
        console.log("message",message)
        PushNotification.localNotification({
            /* Android Only Properties */
            channelId: "notifications", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
            ticker: "My Notification Ticker", // (optional)
            autoCancel: true, // (optional) default: true
            bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
            subText: "This is a subText", // (optional) default: none
            color: "red", // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            priority: "high", // (optional) set notification priority, default: high
            ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
            messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

            actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

            alertAction: "view", // (optional) default: view
            category: "", // (optional) default: empty string

            /* iOS and Android properties */

        });
    });
    return <Provider store={store}>

        <Main/>


    </Provider>
}



AppRegistry.registerComponent(appName, () => MainApplication);
