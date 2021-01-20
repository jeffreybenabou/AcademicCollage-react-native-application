import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from '@react-navigation/native';
import React from "react";
import FastImage from 'react-native-fast-image'
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    DEFINITIONS,
    HEIGHT_OF_SCREEN,
    ICON_TYPES,
    SCREEN_NAMES,
    WIDTH_OF_SCREEN
} from "../utils";
import {Image, SafeAreaView, Text, View} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler'

import {createStackNavigator} from "@react-navigation/stack";
import auth from '@react-native-firebase/auth';
import {SET_STATE} from "../redux/types";
import AllCategories from "../screens/AllCategories";
import QA from "../screens/QA";
import Settings from "../screens/Settings";
import HomeWorkAndSolution from "../screens/HomeWorkAndSolution";
import Ripple from "react-native-material-ripple";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigation = (props) => {
    return <NavigationContainer>
        <Drawer.Navigator
            drawerStyle={{width: '66%'}}
            drawerContent={(navigation) => <DrawerContent navigation={navigation} props={props}/>}
            initialRouteName={SCREEN_NAMES.ALL_CATEGORIES}>
            <Drawer.Screen name={"stack"}>
                {() => <Stack.Navigator
                    screenOptions={{
                        headerShown: true,
                        header: (navigation) => <SafeAreaView style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: APP_COLOR.main,
                            height: HEIGHT_OF_SCREEN / 15,
                            width: WIDTH_OF_SCREEN
                        }}>
                            <Text style={{
                                fontSize: calculateFontSizeByScreen(16 + props.props[DEFINITIONS.TEXT_SIZE]),
                                color: 'white'
                            }}>{props.props[DEFINITIONS.TEXT_ON_HEADER]}</Text>
                            <CustomButton
                                iconSize={WIDTH_OF_SCREEN/80}
                                disabled={false}
                                showLoader={false}
                                style={{position: 'absolute', left:WIDTH_OF_SCREEN/20}}
                                iconType={ICON_TYPES.DRAWER}
                                onPress={() => {
                                    navigation.navigation.toggleDrawer();
                                }}/>


                        </SafeAreaView>,
                    }}>
                    <Stack.Screen name={SCREEN_NAMES.ALL_CATEGORIES} component={AllCategories}/>
                    <Stack.Screen name={SCREEN_NAMES.QA} component={QA}/>
                    <Stack.Screen name={SCREEN_NAMES.HOME_WORK} component={HomeWorkAndSolution}/>
                    <Stack.Screen name={SCREEN_NAMES.SETTINGS} component={Settings}/>
                </Stack.Navigator>}
            </Drawer.Screen>

        </Drawer.Navigator>
    </NavigationContainer>
}
const DrawerContent = (props) => {
    const props2 = props.props.props;

    return <SafeAreaView
        style={{flex: 1, zIndex: 1,paddingStart:'6%', backgroundColor: APP_COLOR.screenBackground, alignItems: 'flex-start'}}>


        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: '5%'}}>
            <FastImage resizeMode={'contain'} style={{
                margin: '5%',
                borderColor: 'gray',
                borderWidth: 0.5,
                borderRadius: WIDTH_OF_SCREEN / 5 / 2,
                width: WIDTH_OF_SCREEN / 5,
                height: WIDTH_OF_SCREEN / 5
            }} source={{uri: props2[DEFINITIONS.USER][DEFINITIONS.USER_IMAGE]}}/>
            <Text style={{
                flex:1,
                fontSize: calculateFontSizeByScreen(14 + props2[DEFINITIONS.TEXT_SIZE]),

                textAlign: 'left'
            }}>{"שם משתמש:\n"}{props2[DEFINITIONS.USER][DEFINITIONS.USER_NAME]}</Text>
        </View>

        <DrawerButton
            fontSize={props2[DEFINITIONS.TEXT_SIZE]}
            onPress={() => {
                props2[SET_STATE]({
                    [DEFINITIONS.TEXT_ON_HEADER]: 'מערך שיעור'
                })
                props.navigation.navigation.navigate(SCREEN_NAMES.ALL_CATEGORIES)
            }} icon={ICON_TYPES.ALL_CATEGORIES} text={"מערך שיעור"}/>
        <DrawerButton
            fontSize={props2[DEFINITIONS.TEXT_SIZE]}
            onPress={() => {
                props2[SET_STATE]({
                    [DEFINITIONS.TEXT_ON_HEADER]: "צ'אט"
                })
                props.navigation.navigation.navigate(SCREEN_NAMES.QA)
            }} icon={ICON_TYPES.CHAT} text={"צ'אט"}/>
        <DrawerButton
            fontSize={props2[DEFINITIONS.TEXT_SIZE]}
            onPress={() => {
                props2[SET_STATE]({
                    [DEFINITIONS.TEXT_ON_HEADER]: 'תרגילים'
                })
                props.navigation.navigation.navigate(SCREEN_NAMES.HOME_WORK)
            }} icon={ICON_TYPES.HOME_WORK} text={"תרגילים"}/>

        <DrawerButton
            fontSize={props2[DEFINITIONS.TEXT_SIZE]}
            onPress={() => {
                props2[SET_STATE]({
                    [DEFINITIONS.TEXT_ON_HEADER]: 'הגדרות'
                })
                props.navigation.navigation.navigate(SCREEN_NAMES.SETTINGS)
            }} icon={ICON_TYPES.SETTINGS} text={"הגדרות"}/>
        <DrawerButton
            fontSize={props2[DEFINITIONS.TEXT_SIZE]}
            onPress={async () => {
                await auth().signOut();

                props2[SET_STATE]({
                    [DEFINITIONS.IS_LOG_IN]: false
                })
            }} icon={ICON_TYPES.LOG_OUT} text={"התנתק"}/>

    </SafeAreaView>
}

const DrawerButton = (props) => {
    return <CustomButton
        iconSize={WIDTH_OF_SCREEN / 100}
        onPress={props.onPress}
        textStyle={{
            fontSize: calculateFontSizeByScreen(14 + props.fontSize),
            marginStart: '5%'
        }}
        style={{

            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            flexDirection: 'row-reverse',
            padding: WIDTH_OF_SCREEN / 30,

        }}
        text={props.text}
        iconType={props.icon}/>
}
export default DrawerNavigation
