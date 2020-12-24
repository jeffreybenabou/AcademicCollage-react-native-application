import React, {useEffect, useState} from "react";
/*
*
* */
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import {connect} from "react-redux";
import {View, StyleSheet, Text, TouchableOpacity, SafeAreaViewComponent, SafeAreaView, Platform} from "react-native";
import LoginScreen from "./LoginScreen";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import LottieView from 'lottie-react-native';
import {
    TYPE_OF_SNACK_BAR,
    APP_COLOR,
    calculateFontSizeByScreen,
    DEFINITIONS,
    HEIGHT_OF_SCREEN,
    languageRestart,
    WIDTH_OF_SCREEN, isNotUndefined, getData, Popup
} from "../utils";
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import auth from '@react-native-firebase/auth';
import {SET_STATE} from "../redux/types";
import Drawer from "../navigation/Drawer";
import * as Animatable from 'react-native-animatable';
import functions from '@react-native-firebase/functions';
import {not} from "react-native-reanimated";

const Main = (props) => {
    useEffect(() => {






            checkIfUserIsConnected();


    }, [])
    const requestPermission = async () => {

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            messaging()
                .getToken().then((token) => {
                console.log("token",token)
            })

            messaging().onMessage((notification) => {
                if(Platform.OS=="ios")
                PushNotification.localNotification({
                    message:notification.notification.body,
                    title:notification.notification.title,
                    /* Android Only Properties */
                    bigText:notification.notification.title, // (optional) default: "message" prop

                });


                console.log("notification",notification)
            })


            messaging()
                .subscribeToTopic('test')
                .then(() => console.log('Subscribed to topic!'));

            PushNotification.createChannel(
                {
                    channelId: "notifications", // (required)
                    channelName: "notifications", // (required)
                    channelDescription: "קבלת נוטיפיקציות בקשר לשיעור", // (optional) default: undefined.
                    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                    importance:8, // (optional) default: 4. Int value of the Android notification importance
                    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                },
                (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
            );

        }

    }
    const checkIfUserIsConnected = async () => {
        if (auth().currentUser != null) {
            requestPermission();

            const sourceCode=await getData(DEFINITIONS.COURSE_CODE);
            let fontSize=parseInt(await getData(DEFINITIONS.TEXT_SIZE))
            fontSize=isNaN(fontSize)?0:fontSize
            const user={
                [DEFINITIONS.USER_NAME]:await getData(DEFINITIONS.USER_NAME),
                [DEFINITIONS.USER_EMAIL]:await getData(DEFINITIONS.USER_EMAIL),
                [DEFINITIONS.USER_IMAGE]:await getData(DEFINITIONS.USER_IMAGE),
            }
            props[SET_STATE]({
                [DEFINITIONS.TEXT_SIZE]:fontSize,
                [DEFINITIONS.COURSE_CODE]:sourceCode,
                [DEFINITIONS.IS_LOG_IN]: true,
                [DEFINITIONS.USER]:user
            })



        }

    }
    const SnackBar = (props2) => {
        const props = props2.props
        return <Animatable.View
            useNativeDriver={true}
            duration={1000}
            animation={'zoomIn'}
            onLayout={() => {
                setTimeout(() => {
                    props[SET_STATE]({
                        [DEFINITIONS.SNACK_BAR]:
                            {
                                [DEFINITIONS.SHOW_SNACK_BAR]: false,
                                [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                                },
                                [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.GOOD,
                                [DEFINITIONS.TITLE_ON_SNACK_BAR]: '',
                                [DEFINITIONS.TEXT_ON_SNACK_BAR]: '',
                                [DEFINITIONS.TIME_TO_SHOW_SNACK_BAR]: 0

                            }
                    })


                }, props[DEFINITIONS.SNACK_BAR][DEFINITIONS.TIME_TO_SHOW_SNACK_BAR]);
            }}
            style={{
                zIndex: 1000,
                bottom: 0,
                marginBottom: HEIGHT_OF_SCREEN / 20,
                width: WIDTH_OF_SCREEN * 0.85,
                alignSelf: 'center',
                alignItems: 'flex-end',
                position: 'absolute',
            }}>


            <TouchableOpacity style={{
                flex: 1,
                padding: WIDTH_OF_SCREEN / 25,
                borderWidth: 0.5,
                borderColor: 'gray',
                borderTopWidth: HEIGHT_OF_SCREEN / 250,
                borderTopColor: props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.ERROR ? 'red' : props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.WARNING ? 'orange' : 'rgb(40,77,130)',
                backgroundColor: 'white',
                flexDirection: 'row',
            }} onPress={async () => {

                if (isNotUndefined(props[DEFINITIONS.SNACK_BAR][DEFINITIONS.ACTION_ON_SNACK_BAR])) {
                    await props[DEFINITIONS.SNACK_BAR][DEFINITIONS.ACTION_ON_SNACK_BAR]();
                }

                props[SET_STATE]({
                    [DEFINITIONS.SNACK_BAR]:
                        {
                            [DEFINITIONS.SHOW_SNACK_BAR]: false,
                            [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                            },
                            [DEFINITIONS.SNACK_BAR_TYPE]: false,
                            [DEFINITIONS.TITLE_ON_SNACK_BAR]: '',
                            [DEFINITIONS.TEXT_ON_SNACK_BAR]: '',
                            [DEFINITIONS.TIME_TO_SHOW_SNACK_BAR]: 0

                        }
                })
            }}>

                <View style={{flex: 1}}>
                    <Text style={{
                        textAlign: 'left',
                        fontSize: calculateFontSizeByScreen(14+props[DEFINITIONS.TEXT_SIZE]),
                        color: props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.ERROR ? 'red' : props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.WARNING ? 'orange' : 'rgb(40,77,130)',
                    }}>{props[DEFINITIONS.SNACK_BAR][DEFINITIONS.TITLE_ON_SNACK_BAR]}</Text>
                    <Text style={{
                        textAlign: 'left',
                        fontSize: calculateFontSizeByScreen(14+props[DEFINITIONS.TEXT_SIZE]),
                        color: 'black',
                    }}>{props[DEFINITIONS.SNACK_BAR][DEFINITIONS.TEXT_ON_SNACK_BAR]}</Text>
                </View>

                <View style={{alignSelf: 'center'}}>

                    <LottieView
                        autoPlay={true}
                        duration={1000}
                        loop={false}
                        resizeMode={'contain'}
                        style={{
                            height: props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.GOOD ? HEIGHT_OF_SCREEN / 20 : HEIGHT_OF_SCREEN / 30,
                            width: props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.GOOD ? HEIGHT_OF_SCREEN / 15 : HEIGHT_OF_SCREEN / 30,
                        }}
                        source={
                            props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.ERROR ?
                                require('../../res/animation/errorSnackBar.json') :
                                props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.WARNING ?
                                    require('../../res/animation/warning.json') :
                                    require('../../res/animation/goodSnackBar.json')
                        }
                    />


                </View>

            </TouchableOpacity>


        </Animatable.View>;

    };
    return <View style={style.container}>

        {
            !props[DEFINITIONS.IS_LOG_IN] &&
            <View style={{backgroundColor: APP_COLOR.main,flex: 1}}>

            </View>
        }


        <View style={{
            borderTopRightRadius: WIDTH_OF_SCREEN / 10,
            borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
            backgroundColor: APP_COLOR.screenBackground,
            flex: 10
        }}>

            {
                props[DEFINITIONS.IS_LOG_IN] ?
                    <Drawer props={props}/>
                    :
                    <LoginScreen/>
            }


        </View>
        {
            props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SHOW_SNACK_BAR] &&
            <SnackBar props={props}/>
        }
        {
            props[DEFINITIONS.POPUP][DEFINITIONS.POPUP_VISIBLE]&&
                <Popup  children={props[DEFINITIONS.POPUP][DEFINITIONS.POPUP_CHILDREN]}  />
        }


    </View>
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
