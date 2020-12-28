import React, {useEffect,} from "react";
/*
*
* */
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import {connect} from "react-redux";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    I18nManager,
    SafeAreaView,
    Platform,
    Keyboard,
    Linking
} from "react-native";
import LoginScreen from "./LoginScreen";
import firestore from '@react-native-firebase/firestore'
import LottieView from 'lottie-react-native';
import {
    TYPE_OF_SNACK_BAR,
    APP_COLOR,
    calculateFontSizeByScreen,
    DEFINITIONS,
    HEIGHT_OF_SCREEN,
    languageRestart,
    WIDTH_OF_SCREEN, isNotUndefined, getData, Popup, SplashScreen, AppUnderMaintain, CustomButton
} from "../utils";
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import auth from '@react-native-firebase/auth';
import {SET_STATE} from "../redux/types";
import Drawer from "../navigation/Drawer";
import * as Animatable from 'react-native-animatable';
import RNRestart from "react-native-restart";
import {getAppstoreAppMetadata} from "react-native-appstore-version-checker";
import {InterstitialAd, AdEventType} from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1901519090884740/6955333195';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['jewish', 'tech', "learning", "java", "android", "ios", "react-native", "applications", "web", "react"],
});

import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const adUnitIdBanner = __DEV__ ? TestIds.BANNER : 'ca-app-pub-1901519090884740/9665641456';

const Main = (props) => {
    useEffect(() => {


        setListeners();
        checkRtl();
        checkVersion();
        checkIfUserIsConnected();
        checkIfUnderMaintainOrNeedUpdate();
    }, [])

    const setAdMob = () => {
        interstitial.onAdEvent(type => {
            if (type === AdEventType.OPENED) {

            } else if (type === AdEventType.LOADED) {
                interstitial.show()
            }
        });
        interstitial.load();
    }

    const checkIfUnderMaintainOrNeedUpdate = () => {
        firestore().collection("settings").get().then((maintain) => {
            let needUpdate = false, isUnderMaintain = false;
            maintain.docs.map((item, index) => {
                if (index == 0) {
                    isUnderMaintain = item.data().isUnderMaintain
                } else if (index === 1) {
                    needUpdate = Platform.OS == "android" ? item.data().android > 100 : item.data().ios > 100
                }
            })

            props[SET_STATE]({
                [DEFINITIONS.NEED_UPDATE]: needUpdate,
                [DEFINITIONS.APP_UNDER_MAINTAIN]: isUnderMaintain
            })

        })
    }
    const setListeners = () => {
        Keyboard.addListener("keyboardDidShow", (e) => {
            props[SET_STATE]({
                [DEFINITIONS.KEYBOARD_HEIGHT]: e.endCoordinates.height
            })
        });
        Keyboard.addListener("keyboardDidHide", () => {
            props[SET_STATE]({
                [DEFINITIONS.KEYBOARD_HEIGHT]: 0
            })
        });
    }

    const checkVersion = () => {
        getAppstoreAppMetadata("com.supercell.clashofclans") //put any apps packageId here
            .then(metadata => {
                console.log(
                    "clashofclans android app version on playstore",
                    metadata.version,
                    "published on",
                    metadata.currentVersionReleaseDate
                );
            })
            .catch(err => {
                console.log("error occurred", err);
            });

    }
    const checkRtl = async () => {

        if (!I18nManager.isRTL) {
            await I18nManager.forceRTL(true);
            RNRestart.Restart();
        }

    }
    const requestPermission = async () => {

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            messaging()
                .getToken().then((token) => {
                console.log("token", token)
            })

            messaging().onMessage((notification) => {


                if(Platform.OS==="ios")
                    PushNotification.localNotification({
                        message: notification.notification.body,
                        title: notification.notification.title,
                        /* Android Only Properties */
                        bigText: notification.notification.body, // (optional) default: "message" prop

                    });


                console.log("my notification", notification)
            })
            const courseCode = await getData(DEFINITIONS.COURSE_CODE);

            console.log("props[DEFINITIONS.COURSE_CODE]",courseCode)
            messaging()
                .subscribeToTopic(""+courseCode)
                .then(() => console.log('Subscribed to topic!'));

            PushNotification.createChannel(
                {
                    channelId: "notifications", // (required)
                    channelName: "notifications", // (required)
                    channelDescription: "קבלת נוטיפיקציות בקשר לשיעור", // (optional) default: undefined.
                    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                    importance: 4, // (optional) default: 4. Int value of the Android notification importance
                    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
                },
                (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
            );

        }

    }
    const checkIfUserIsConnected = async () => {
        if (auth().currentUser != null) {

            setAdMob();
            const courseCode = await getData(DEFINITIONS.COURSE_CODE);

            let fontSize = parseInt(await getData(DEFINITIONS.TEXT_SIZE))
            fontSize = isNaN(fontSize) ? 0 : fontSize
            const user = {
                [DEFINITIONS.USER_NAME]: await getData(DEFINITIONS.USER_NAME),
                [DEFINITIONS.USER_EMAIL]: await getData(DEFINITIONS.USER_EMAIL),
                [DEFINITIONS.USER_IMAGE]: await getData(DEFINITIONS.USER_IMAGE),
            }
         await   props[SET_STATE]({
                [DEFINITIONS.TEXT_SIZE]: fontSize,
                [DEFINITIONS.COURSE_CODE]: courseCode,
                [DEFINITIONS.IS_LOG_IN]: true,
                [DEFINITIONS.USER]: user,
                [DEFINITIONS.SHOW_SPLASH_SCREEN]: false
            })
            requestPermission();
        } else
            props[SET_STATE]({
                [DEFINITIONS.SHOW_SPLASH_SCREEN]: false
            })

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
                        fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                        color: props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.ERROR ? 'red' : props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SNACK_BAR_TYPE] === TYPE_OF_SNACK_BAR.WARNING ? 'orange' : 'rgb(40,77,130)',
                    }}>{props[DEFINITIONS.SNACK_BAR][DEFINITIONS.TITLE_ON_SNACK_BAR]}</Text>
                    <Text style={{
                        textAlign: 'left',
                        fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
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
    const ShowUpdateScreen = () => {
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color:'black',fontSize:calculateFontSizeByScreen(20),fontWeight:'bold'}}>עדכון גרסה</Text>

            <Text style={{color:'black',fontSize:calculateFontSizeByScreen(16)}}>לחץ על הכפתור מטה על מנת לעדכן את האפליקציה</Text>
            <LottieView
                autoPlay={true}
                duration={7000}
                loop={true}
                resizeMode={'contain'}
                style={{
                    height:HEIGHT_OF_SCREEN/2,
                    marginBottom:HEIGHT_OF_SCREEN/50

                }}
                source={  require('../../res/animation/update.json')}
            />
            <CustomButton
                onPress={() => {
                    try {
                        if (Platform.OS === 'android') {
                            Linking.openURL( 'market://details?id=com.jeffrey.academiccollage' );
                        } else {
                            Linking.openURL( 'https://itunes.apple.com/us/app/expo-client/id1486600202?mt=8');
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }}
                textStyle={{
                    color:'white',
                    fontSize:calculateFontSizeByScreen(14)
                }}
                style={{
                    borderRadius: WIDTH_OF_SCREEN / 50,
                    paddingHorizontal: '5%',
                    backgroundColor: APP_COLOR.main,
                    height: HEIGHT_OF_SCREEN / 15
                }}
                text={"לחץ כאן לעדכון האפליקציה"}/>
        </View>
    }
    return <SafeAreaView style={style.container}>

        {

            !props[DEFINITIONS.IS_LOG_IN] &&
            <View style={{height: HEIGHT_OF_SCREEN / 15, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{
                    fontSize: calculateFontSizeByScreen(16 + props[DEFINITIONS.TEXT_SIZE]),
                    textAlign: "center",
                    color: 'white'
                }}>התחברות</Text>
            </View>
        }


        <View style={{
            borderTopRightRadius: WIDTH_OF_SCREEN / 10,
            borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
            backgroundColor: APP_COLOR.screenBackground,
            flex: 10
        }}>

            {
                props[DEFINITIONS.NEED_UPDATE] ?
                    <ShowUpdateScreen/> :
                    props[DEFINITIONS.APP_UNDER_MAINTAIN] ?
                        <AppUnderMaintain/> :
                        props[DEFINITIONS.SHOW_SPLASH_SCREEN] ?
                            <SplashScreen/> :
                            props[DEFINITIONS.IS_LOG_IN] ?
                                <Drawer props={props}/>
                                :
                                <LoginScreen checkIfUserIsConnected={checkIfUserIsConnected}/>
            }


        </View>
        {
            props[DEFINITIONS.SNACK_BAR][DEFINITIONS.SHOW_SNACK_BAR] &&
            <SnackBar props={props}/>
        }
        {
            props[DEFINITIONS.POPUP][DEFINITIONS.POPUP_VISIBLE] &&
            <Popup children={props[DEFINITIONS.POPUP][DEFINITIONS.POPUP_CHILDREN]}/>
        }

        {
            props[DEFINITIONS.IS_LOG_IN] &&
            <View style={{alignItems: 'center', backgroundColor: APP_COLOR.screenBackground}}>
                <BannerAd
                    unitId={adUnitIdBanner}
                    size={BannerAdSize.ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: false,
                    }}
                />
            </View>
        }


    </SafeAreaView>
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
