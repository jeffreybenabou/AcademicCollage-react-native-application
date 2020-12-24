import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from '@react-navigation/native';
import React from "react";
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    DEFINITIONS,
    HEIGHT_OF_SCREEN,
    ICON_TYPES,
    SCREEN_NAMES,
    WIDTH_OF_SCREEN
} from "../utils";
import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";

import {createStackNavigator} from "@react-navigation/stack";
import auth from '@react-native-firebase/auth';
import {SET_STATE} from "../redux/types";
import AllCategories from "../screens/AllCategories";
import QA from "../screens/QA";
import Settings from "../screens/Settings";
import HomeWorkAndSolution from "../screens/HomeWorkAndSolution";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigation = (props) => {
    return <NavigationContainer>
        <Drawer.Navigator drawerContent={(navigation) => <DrawerContent navigation={navigation} props={props}/>}
                          initialRouteName={SCREEN_NAMES.ALL_CATEGORIES}>
            <Drawer.Screen name={"stack"}>
                {() => <Stack.Navigator
                    screenOptions={{
                        headerShown: true,
                        header: () => <SafeAreaView style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: APP_COLOR.main,
                            height: HEIGHT_OF_SCREEN / 8,
                            width: WIDTH_OF_SCREEN
                        }}>
                            <Text style={{
                                fontSize: calculateFontSizeByScreen(20 + props.props[DEFINITIONS.TEXT_SIZE]),
                                color: 'white'
                            }}>{props.props[DEFINITIONS.TEXT_ON_HEADER]}</Text>

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

    return <SafeAreaView style={{flex: 1, backgroundColor: APP_COLOR.screenBackground, alignItems: 'flex-start'}}>
        <TouchableOpacity
            onPress={() => {
                props.navigation.navigation.toggleDrawer();
            }}

            style={{
                borderTopRightRadius: WIDTH_OF_SCREEN / 50,
                borderBottomRightRadius: WIDTH_OF_SCREEN / 50,
                borderColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: APP_COLOR.screenBackground,
                height: WIDTH_OF_SCREEN / 8,
                position: 'absolute',
                width: WIDTH_OF_SCREEN / 8,
                right: -WIDTH_OF_SCREEN / 8,
                top: HEIGHT_OF_SCREEN / 20,
                zIndex: 100
            }}>
            <Image style={{
                height: WIDTH_OF_SCREEN / 20 + WIDTH_OF_SCREEN / 100,
                width: WIDTH_OF_SCREEN / 20 + WIDTH_OF_SCREEN / 100,
            }} resizeMode={"contain"} source={require("../../res/icons/left.png")}/>

        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: '5%'}}>
            <Image resizeMode={'contain'} style={{
                borderColor: 'gray',
                borderWidth: 0.5,
                borderRadius: WIDTH_OF_SCREEN / 5 / 2,
                width: WIDTH_OF_SCREEN / 5,
                height: WIDTH_OF_SCREEN / 5
            }} source={{url: props2[DEFINITIONS.USER][DEFINITIONS.USER_IMAGE]}}/>
            <Text style={{
                fontSize: calculateFontSizeByScreen(14 + props2[DEFINITIONS.TEXT_SIZE]),
                marginStart: '5%',
                textAlign: 'left'
            }}>{"שלום, \nג׳פרי בן אבו"}</Text>
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
                    [DEFINITIONS.TEXT_ON_HEADER]: 'צ׳ט'
                })
                props.navigation.navigation.navigate(SCREEN_NAMES.QA)
            }} icon={ICON_TYPES.CHAT} text={"צ׳ט"}/>
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
            fontSize:calculateFontSizeByScreen(14+props.fontSize),
            marginStart: '5%'
        }}
        style={{
            padding:"2%",
            flexDirection: 'row-reverse',
            margin: WIDTH_OF_SCREEN / 30,
        }}
        text={props.text}
        iconType={props.icon}/>
}
export default DrawerNavigation
