import {
    Dimensions,
    Text,
    Linking,
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Image,
    ScrollView,
    Modal,
    ActivityIndicator, SafeAreaView
} from "react-native";

import React from "react";
import PixelRatio from "react-native/Libraries/Utilities/PixelRatio";
import {I18nManager} from "react-native";
import RNRestart from "react-native-restart";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check, PERMISSIONS, request,} from 'react-native-permissions';

let {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');
let scale = SCREEN_WIDTH / 320;
export let HEIGHT_OF_SCREEN = SCREEN_HEIGHT;
export let WIDTH_OF_SCREEN = SCREEN_WIDTH;
import Ripple from 'react-native-material-ripple';
import {RESULTS} from "react-native-permissions";
import FastImage from "react-native-fast-image";
import LottieView from "lottie-react-native";
import Clipboard from "@react-native-community/clipboard";
import {SET_STATE} from "./redux/types";
import ImageZoom from "react-native-image-pan-zoom";

export const languageRestart = async () => {


    if (I18nManager.isRTL) {

    } else if (!I18nManager.isRTL) {
        await I18nManager.forceRTL(true);
        await I18nManager.allowRTL(true);

        RNRestart.Restart();
    }

};
export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem("" + key, value)
    } catch (e) {
        // saving error
    }
}

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem("" + key)
        if (value !== null) {

            return value;
        }
    } catch (e) {
        // error reading value
    }
}
export const TYPE_OF_SNACK_BAR = {
    ERROR: 0,
    WARNING: 1,
    GOOD: 2
}
export const AppUnderMaintain = () => {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{
            fontSize: calculateFontSizeByScreen(16),
            color: 'black',

        }}>האפליקציה בתחזוקה כרגע, נחזור בהקדם...</Text>
        <LottieView style={{height: HEIGHT_OF_SCREEN / 2}}
                    source={require('../res/animation/maintain.json')} autoPlay loop/>
    </View>
}
export const DEFINITIONS = {
    IS_LOG_IN: 'isLogIn',
    NEED_UPDATE: 'needUpdate',
    APP_UNDER_MAINTAIN: 'appUnderMaintain',
    SHOW_SPLASH_SCREEN: 'splashScreen',
    TEXT_SIZE: 'textSize',
    KEYBOARD_HEIGHT: 'keyboardHeight',
    TEXT_ON_HEADER: 'textOnHeader',
    SHOW_SNACK_BAR: 'showSnackBar',
    ACTION_ON_SNACK_BAR: 'actionOnSnackBar',
    SNACK_BAR: 'snackBar',
    SNACK_BAR_TYPE: 'snackBarType',
    TITLE_ON_SNACK_BAR: 'titleOnSnackBar',
    TEXT_ON_SNACK_BAR: 'textOnSnackBar',
    TIME_TO_SHOW_SNACK_BAR: 'timeToShowSnackBar',
    COURSE_CODE: 'courseCode',
    USER: 'user',
    USER_NAME: 'userName',
    USER_EMAIL: 'userEmail',
    USER_IMAGE: 'userImage',
    POPUP: 'popup',
    POPUP_CHILDREN: 'popupChildren',
    POPUP_VISIBLE: 'popupVisible',


}
export const calculateFontSizeByScreen = (size) => {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }


};


export const CustomButton = (props) => {

    return <Ripple
        rippleDuration={600}
        rippleCentered={false}
        disabled={props.disabled}
        rippleColor={APP_COLOR.iconColor}
        onPress={props.onPress}
        style={[{flexDirection: 'row', alignItems: 'center'}, props.style]}
    >

        <Text style={[props.textStyle]}>
            {props.text}
        </Text>

        <View>

            <SetIcon iconSize={props.iconSize} iconType={props.iconType}/>
            {
                props.children
            }


        </View>
        {
            props.showLoader &&
            <ActivityIndicator style={{position: 'absolute'}} color={"black"} size={'100%'} animating={true}/>
        }


    </Ripple>
}

export const Popup = (props) => {


    return <Modal
        presentationStyle={"overFullScreen"}
        visible={true}
        transparent={true}>
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: HEIGHT_OF_SCREEN,
            width: WIDTH_OF_SCREEN,
            backgroundColor: 'rgba(0,0,0,0.5)'
        }}>


            {
                props.children()
            }


        </View>

    </Modal>
}
Popup.props = {
    children: ""
}

export const shuffleArray = (array) => {
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export const typeOfComponent = (item, props,colorOfCodeComponent) => {
    if (item.includes("%title%")) {
        return <Text
            style={{
                color:'black',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '2%',
                fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE])
            }}>{item.replace("%title%", "")}</Text>
    } else if (item.toString().includes("#code#")) {
        return <View style={{

            backgroundColor:colorOfCodeComponent?"white": 'rgb(233,232,232)',

            flexDirection: 'row',
            borderRadius: WIDTH_OF_SCREEN / 50,
        }}>
            <CustomButton
                style={{zIndex: 100, padding: '5%', alignSelf: 'flex-start'}}
                iconType={ICON_TYPES.COPY}
                onPress={() => {
                    Clipboard.setString(item.toString().replace("#code#", "").replace(/~/g, "\n"));
                    props[SET_STATE]({
                        [DEFINITIONS.SNACK_BAR]:
                            {
                                [DEFINITIONS.SHOW_SNACK_BAR]: true,
                                [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                                },
                                [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.GOOD,
                                [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'קטע הקוד הועתק אל המכשיר',
                                [DEFINITIONS.TEXT_ON_SNACK_BAR]: '',

                            }
                    })
                }}
            />

            <Text

                style={{
                    flex: 1,
                    margin: '5%',

                    fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                    color: 'black',
                    textAlign: 'right',

                }}>{item.toString().replace(/#code#/g, "").replace(/~/g, "\n")}</Text>
        </View>

    } else if (item.toString().includes("%b%")) {
        return <Text style={{
            fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
            textAlign: 'left',
            color: 'gray',
            fontWeight: 'bold'
        }}>{item.toString().replace(/%b%/g, "")}</Text>
    } else if (item.toString().includes("~")) {
        return <Text
            style={{
                fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                color: 'gray',
                textAlign: 'left',
            }}>{item.toString().replace(/~/g, "\n")}</Text>
    } else if (item.toString().includes("!image!")) {
        return <CustomButton
            onPress={() => {
                props[SET_STATE]({
                    [DEFINITIONS.POPUP]: {
                        [DEFINITIONS.POPUP_CHILDREN]:
                            () => <SafeAreaView
                                style={{
                                    flex: 1, height: HEIGHT_OF_SCREEN, width: WIDTH_OF_SCREEN
                                }}
                            >
                                <CustomButton
                                    style={{
                                        backgroundColor:'white',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 100,
                                        position: 'absolute',
                                        margin: '2%',
                                        borderRadius:WIDTH_OF_SCREEN/10,
                                    }}
                                    iconSize={WIDTH_OF_SCREEN / 50}
                                    iconType={ICON_TYPES.CLOSE}
                                    onPress={() => {
                                        props[SET_STATE]({
                                            [DEFINITIONS.POPUP]: {
                                                [DEFINITIONS.POPUP_VISIBLE]: false
                                            }

                                        })
                                    }}/>
                                <ImageZoom
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',

                                    }
                                    }
                                    cropHeight={HEIGHT_OF_SCREEN}
                                    cropWidth={WIDTH_OF_SCREEN}
                                    imageWidth={WIDTH_OF_SCREEN}
                                    imageHeight={HEIGHT_OF_SCREEN}>

                                    <FastImage
                                        resizeMode={"contain"}
                                        style={{

                                            transform: [
                                                {
                                                    rotate: '90deg'
                                                }
                                            ],
                                            alignSelf: 'center',
                                            height:'100%',
                                            width:HEIGHT_OF_SCREEN/1.2

                                        }}
                                        source={{uri: item.toString().replace("!image!", "")}}/>

                                </ImageZoom>
                            </SafeAreaView>

                        ,
                        [DEFINITIONS.POPUP_VISIBLE]: true
                    }
                })
            }}
            children={


                <FastImage
                    resizeMode={"stretch"}
                    style={{
                        borderRadius: WIDTH_OF_SCREEN / 50,
                        backgroundColor: 'white',
                        width: WIDTH_OF_SCREEN / 1.2,
                        height: HEIGHT_OF_SCREEN / 3,
                        marginBottom: HEIGHT_OF_SCREEN / 50

                    }}
                    source={{uri: item.toString().replace("!image!", "")}}>
                    <View style={{
                        borderRadius: WIDTH_OF_SCREEN / 50,
                        margin: '1%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        backgroundColor: 'rgba(256,256,256,0.8)',
                        position: 'absolute'
                    }}>
                        <SetIcon iconSize={0} iconType={ICON_TYPES.FULL_SCREEN}/>
                    </View>
                </FastImage>

            }


        />

    } else if (item.toString().includes("!button!")) {
        return <CustomButton
            text={item.toString().split("!index!")[0].replace('!button!', "")}
            textStyle={{
                fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                color: 'white',
                textAlign: 'left',
            }}
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                width: WIDTH_OF_SCREEN / 1.1,
                borderRadius: WIDTH_OF_SCREEN / 10,
                minHeight: HEIGHT_OF_SCREEN / 15,
                backgroundColor: APP_COLOR.main,
                marginVertical:HEIGHT_OF_SCREEN/50
            }}
            onPress={() => {
                const index = item.toString().replace("!image!", "").split("!index!")[1]
                props.navigation.navigate(SCREEN_NAMES.HOME_WORK, {index: parseInt(index)});
            }
            }


        />

    }else if(item.toString().includes("!link!")){
        return  <Text
            onPress={()=>{
                Linking.openURL(item.toString().replace("!link!","")).catch(err => console.error('An error occurred', err));
            }
            }
            style={{
                borderBottomWidth:1,
                fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                color: 'gray',
                textAlign: 'left',
            }}>{item.toString().replace("!link!","")}</Text>

    } else {
        return <Text
            style={{

                fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                color: 'gray',
                textAlign: 'left',
            }}>{item}</Text>
    }
}

export const SCREEN_NAMES = {
    ALL_CATEGORIES: 'allCategories',
    QA: 'qa',
    SETTINGS: 'settings',
    HOME_WORK: 'homeWork',
    SOLUTION: 'solution'
}
export const SetIcon = (props) => {
    let iconSize = isNotUndefined(props.iconSize) ? props.iconSize : 0;

    switch (props.iconType) {

        case ICON_TYPES.LEFT:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/left.png')}/>
        case ICON_TYPES.PASSWORD:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/luggage.png')}/>
        case ICON_TYPES.USER_NAME:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/user.png')}/>
        case ICON_TYPES.FACEBOOK:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 10 + iconSize, height: WIDTH_OF_SCREEN / 10 + iconSize}}
                source={require('../res/icons/facebook.png')}/>
        case ICON_TYPES.GMAIL:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/gmail.png')}/>
        case ICON_TYPES.ALL_CATEGORIES:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image  style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/tasks.png')}/>
            </View>
        case ICON_TYPES.CHAT:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image resizeMode={"contain"} style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/chat.png')}/>
            </View>
        case ICON_TYPES.SOLUTION:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image resizeMode={"contain"} style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/testing.png')}/>
            </View>
        case ICON_TYPES.SETTINGS:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image resizeMode={"contain"} style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/options.png')}/>
            </View>
        case ICON_TYPES.HOME_WORK:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image resizeMode={"contain"} style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/comments.png')}/>
            </View>
        case ICON_TYPES.LOG_OUT:
            return <View style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}>
                <Image resizeMode={"contain"} style={{flex: 1, width: '100%'}}
                       source={require('../res/icons/exit.png')}/>
            </View>
        case ICON_TYPES.ARROW_DOWN:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/down-arrow.png')}/>
        case ICON_TYPES.ARROW_UP:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/up-arrow.png')}/>
        case ICON_TYPES.COPY:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/copy.png')}/>
        case ICON_TYPES.APPLE:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/apple.png')}/>

        case ICON_TYPES.CLOSE:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/close-icon-29.png')}/>
        case ICON_TYPES.DRAWER:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/menu.png')}/>
        case ICON_TYPES.FULL_SCREEN:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/full-screen.png')}/>
        case ICON_TYPES.SEARCH:
            return <FastImage
                style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                source={require('../res/icons/search.png')}/>
        default:
            return <View/>
    }

}

export const isNotUndefined = (value) => {
    return typeof (value) !== undefined && typeof (value) !== 'undefined' && typeof (value) != 'undefined' && value != null && value != 'undefined';
};

SetIcon.props = {
    iconType: '',
    iconSize: '',
    iconColor: ''
}

export const ICON_TYPES = {
    FACEBOOK: 'facebook',
    COPY: 'copy',
    SEARCH: 'search',
    FULL_SCREEN: 'fullScreen',
    GMAIL: 'gmail',
    CLOSE: 'close',
    USER_NAME: 'userName',
    PASSWORD: 'password',
    ALL_CATEGORIES: 'allCategories',
    CHAT: 'chat',
    HOME_WORK: 'homeWork',
    SOLUTION: 'solution',
    SETTINGS: 'settings',
    LOG_OUT: 'logOut',
    ARROW_DOWN: 'arrowDown',
    ARROW_UP: 'arrowUp',
    LEFT: 'left',
    APPLE: 'apple',
    DRAWER: 'menu'


}
export const SplashScreen = () => {
    return <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: APP_COLOR.screenBackground,
        width: WIDTH_OF_SCREEN,
        height: HEIGHT_OF_SCREEN
    }}>
        <FastImage style={{height: HEIGHT_OF_SCREEN / 1.5, width: WIDTH_OF_SCREEN / 1.5}} resizeMode={"contain"}
                   source={require("../res/images/logo.png")}/>
        <Text style={{fontSize: calculateFontSizeByScreen(20), color: 'black', marginVertical: '5%'}}>תכף
            עולים...</Text>
        <ActivityIndicator animating={true} size={WIDTH_OF_SCREEN / 10} color={APP_COLOR.iconColor}/>

    </View>
}

export const requestPermission = (permission) => {
    return check(permission)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    request(permission).then((result) => {
                        return true
                    });
                    console.log('The permission has not been requested / is denied but requestable');
                    break;
                case RESULTS.LIMITED:
                    console.log('The permission is limited: some actions are possible');
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    return true

                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }


        })
        .catch((error) => {
            // …
        });


}

export const CustomInput = (props) => {
    return <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}, props.style]}>

        <Ripple onPress={props.actionOnIconPress}>
            <SetIcon iconSize={props.iconSize} iconType={props.iconType}/>
        </Ripple>

        <View style={{marginStart: WIDTH_OF_SCREEN / 80}}/>
        <TextInput placeholderTextColor={"gray"}
                   multiline={props.multiline}
                   autoCapitalize={"none"}
                   style={props.textStyle}
                   value={props.value}
                   onChangeText={props.onChangeText}
                   placeholder={props.placeholder}
        />


    </View>
}

CustomInput.props = {
    placeholder: '',
    value: '',
    actionOnIconPress: '',
    onChangeText: '',
    style: '',
    textStyle: '',
    iconType: '',
    iconSize: '',
    multiline: ''

}

CustomButton.props = {
    style: '',
    iconType: '',
    onPress: '',
    text: '',
    textStyle: '',
    iconSize: '',
    children: '',
    showLoader: '',
    disabled: ''

}
const style = StyleSheet.create({
    customButtonText: {
        fontSize: calculateFontSizeByScreen(12)
    }
})
export const elevationShadowStyle = (elevation) => {
    return {
        elevation,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0.5 * elevation},
        shadowOpacity: 0.3,
        shadowRadius: 0.8 * elevation,
    };
};

export const APP_COLOR = {
    main: '#4A65E3',
    screenBackground: '#eff1fb',
    iconColor: '#54D4F3',
    QABackground: 'rgba(255,255,255,0.6)'
}
