import {
    Dimensions,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Image,
    ScrollView,
    Modal,
    ActivityIndicator
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
export const DEFINITIONS = {
    IS_LOG_IN: 'isLogIn',
    TEXT_SIZE: 'textSize',
    KEYBOARD_HEIGHT:'keyboardHeight',
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
    return Math.round(PixelRatio.roundToNearestPixel(size));
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
            props.showLoader&&
                <ActivityIndicator style={{position:'absolute'}} color={"black"} size={'100%'} animating={true}/>
        }


    </Ripple>
}

export const Popup=(props)=>{


    return <Modal visible={true} style={{
        height:HEIGHT_OF_SCREEN/1.3,
        width:WIDTH_OF_SCREEN/1.2
    }} >
        {
            props.children
        }
    </Modal>
}
Popup.props={
    children:""
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
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/left.png')}/>
        case ICON_TYPES.PASSWORD:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/luggage.png')}/>
        case ICON_TYPES.USER_NAME:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/user.png')}/>
        case ICON_TYPES.FACEBOOK:
            return <Image style={{width: WIDTH_OF_SCREEN / 10 + iconSize, height: WIDTH_OF_SCREEN / 10 + iconSize}}
                          source={require('../res/icons/facebook.png')}/>
        case ICON_TYPES.GMAIL:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/gmail.png')}/>
        case ICON_TYPES.ALL_CATEGORIES:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/tasks.png')}/>
        case ICON_TYPES.CHAT:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/chat.png')}/>
        case ICON_TYPES.SOLUTION:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/testing.png')}/>
        case ICON_TYPES.SETTINGS:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/options.png')}/>
        case ICON_TYPES.HOME_WORK:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/comments.png')}/>
        case ICON_TYPES.LOG_OUT:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/exit.png')}/>
        case ICON_TYPES.ARROW_DOWN:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/down-arrow.png')}/>
        case ICON_TYPES.ARROW_UP:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/up-arrow.png')}/>
        case ICON_TYPES.COPY:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/copy.png')}/>
        case ICON_TYPES.APPLE:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/apple.png')}/>

        case ICON_TYPES.CLOSE:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/close-icon-29.png')}/>
        case ICON_TYPES.DRAWER:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/menu.png')}/>
        case ICON_TYPES.FULL_SCREEN:
            return <Image style={{width: WIDTH_OF_SCREEN / 20 + iconSize, height: WIDTH_OF_SCREEN / 20 + iconSize}}
                          source={require('../res/icons/full-screen.png')}/>

        default:
            return <View/>
    }

}

export const isNotUndefined = (value) => {
    return typeof (value) !== 'undefined' && value != null && value != 'undefined';
};

SetIcon.props = {
    iconType: '',
    iconSize: '',
    iconColor: ''
}

export const ICON_TYPES = {
    FACEBOOK: 'facebook',
    COPY: 'copy',
    FULL_SCREEN:'fullScreen',
    GMAIL: 'gmail',
    CLOSE:'close',
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
    APPLE:'apple',
    DRAWER:'menu'


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
        <TextInput
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
    multiline:''

}

CustomButton.props = {
    style: '',
    iconType: '',
    onPress: '',
    text: '',
    textStyle: '',
    iconSize: '',
    children: '',
    showLoader:'',
    disabled:''

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
