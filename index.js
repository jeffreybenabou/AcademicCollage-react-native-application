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

const MainApplication =   () => {

    return <Provider  store={store}>


        <Main/>


    </Provider>
}

messaging().setBackgroundMessageHandler(async (message) => {
    console.log("message",message)
})




AppRegistry.registerComponent(appName, ()=>  MainApplication);

