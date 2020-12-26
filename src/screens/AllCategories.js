import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    Linking,
    ScrollView,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Keyboard,
    Platform, SafeAreaView
} from "react-native";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import Clipboard from '@react-native-community/clipboard';

import firestore from '@react-native-firebase/firestore'
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    DEFINITIONS,
    elevationShadowStyle,
    HEIGHT_OF_SCREEN, ICON_TYPES,
    isNotUndefined, SetIcon, TYPE_OF_SNACK_BAR,
    WIDTH_OF_SCREEN
} from "../utils";
import {SET_STATE} from "../redux/types";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import ImageZoom from 'react-native-image-pan-zoom';
import functions from "@react-native-firebase/functions";
import messaging from '@react-native-firebase/messaging'
import FastImage from "react-native-fast-image";

const AllCategories = (props) => {
    const [lessons, setLessons] = useState([])
    const [openLessons, setOpenLessons] = useState([]);
    const [buttonsPlaceHolder, setButtonPlaceHolder] = useState([]);


    const setTheConfigItem = (item) => {
        const lessons = [];
        const buttonsPlaceHolder = [];
        const openLessons2 = [];

        item.map((item) => {

            let objectToRender = [];
            Object.keys(item).sort((a, b) => a > b ? 1 : -1).map((item2) => {

                if (item2.match(/\d/)) {
                    if ((item[item2].toString().includes("#code#"))) {
                        objectToRender.push(
                            <View style={{
                                marginVertical: '5%',
                                backgroundColor: 'rgba(255,255,255,1)',
                                width: '100%',
                                borderRadius: WIDTH_OF_SCREEN / 50,
                            }}>
                                <CustomButton
                                    style={{zIndex: 100, position: 'absolute', padding: WIDTH_OF_SCREEN / 20}}
                                    iconType={ICON_TYPES.COPY}
                                    onPress={() => {
                                        Clipboard.setString('hello world');
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
                                        fontSize: calculateFontSizeByScreen(12 + props[DEFINITIONS.TEXT_SIZE]),
                                        color: 'black',
                                        textAlign: 'right',

                                    }}>{item[item2].toString().replace(/#code#/g, "\n").replace(/~/g, "\n")}</Text>
                            </View>
                        )
                    } else if (item[item2].toString().includes("%b%")) {
                        objectToRender.push(<Text style={{
                            fontSize: calculateFontSizeByScreen(14 + props[DEFINITIONS.TEXT_SIZE]),
                            textAlign: 'left',
                            color: 'gray',
                            fontWeight: 'bold'
                        }}>{item[item2].toString().replace(/%b%/g, "")}</Text>)
                    } else if (item[item2].toString().includes("~")) {
                        objectToRender.push(
                            <Text
                                style={{
                                    fontSize: calculateFontSizeByScreen(12 + props[DEFINITIONS.TEXT_SIZE]),
                                    color: 'gray',
                                    textAlign: 'left',
                                }}>{item[item2].toString().replace(/~/g, "\n")}</Text>)
                    } else if (item[item2].toString().includes("!image!")) {
                        objectToRender.push(
                            <CustomButton
                                onPress={() => {
                                    props[SET_STATE]({
                                        [DEFINITIONS.POPUP]: {
                                            [DEFINITIONS.POPUP_CHILDREN]:
                                                <SafeAreaView horizontal={true} style={{flex: 1}}>
                                                    <CustomButton
                                                        style={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 100,
                                                            position: 'absolute',
                                                            margin: '2%'
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
                                                        cropHeight={HEIGHT_OF_SCREEN}
                                                        cropWidth={WIDTH_OF_SCREEN}
                                                        imageWidth={WIDTH_OF_SCREEN}
                                                        imageHeight={HEIGHT_OF_SCREEN / 3}>

                                                        <FastImage resizeMode={"contain"} style={{
                                                            flex: 1,
                                                            width: WIDTH_OF_SCREEN,
                                                            height: '100%',
                                                            alignSelf: 'center'
                                                        }}
                                                                   source={{uri: item[item2].toString().replace("!image!", "")}}/>

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
                                                borderRadius:WIDTH_OF_SCREEN/50,
                                                backgroundColor: 'white',
                                                width: WIDTH_OF_SCREEN / 1.2,
                                                height: HEIGHT_OF_SCREEN/3,
                                                marginBottom:HEIGHT_OF_SCREEN/50

                                            }}
                                            source={{uri: item[item2].toString().replace("!image!", "")}}>
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
                        )
                    } else {
                        objectToRender.push(<Text
                            style={{
                                fontSize: calculateFontSizeByScreen(12 + props[DEFINITIONS.TEXT_SIZE]),
                                color: 'gray',
                                textAlign: 'left',
                            }}>{item[item2]}</Text>)
                    }


                }

            })

            lessons.push(objectToRender)
            buttonsPlaceHolder.push({
                url: item.url,
                type: item.type,
                text: item.buttonPlaceholder,
                visible: item.visible
            })
            openLessons2.push(false)
            /*const view=<View>
                {
                    Object.values(item).map((test)=>{
                        console.log(test)
                        if(test.includes("%b%")){
                            return <Text>testtt</Text>
                        }
                    })
                }
            </View>
            lessons.push(view)*/

        })
        setLessons(lessons);
        setButtonPlaceHolder(buttonsPlaceHolder);
        setOpenLessons(openLessons2);
    }
    const loadLessonsNamesFromFB = async () => {
        /* await firestore()
             .collection("webHomeWork")
             .get()
             .then((lessons) => {

                 let a= {};
                 lessons.docs.map((item,index)=>{
                     a={...a,[index<9?index:"9"+index]:item.data()}

                 })
                  firestore()
                     .collection("web2020").doc("homeWork").set(a)

             })*/

        await firestore()
            .collection("" + props[DEFINITIONS.COURSE_CODE])
            .doc("lessons")
            .get()
            .then(lessons => {
                const lessonsToAdd = [];
                Object.keys(lessons._data).map((item) => {
                    lessonsToAdd.push(lessons._data[item])
                })
                setTheConfigItem(lessonsToAdd);

            })
    }


    useEffect(() => {
        loadLessonsNamesFromFB();
        props.navigation.addListener('blur', (e) => {
            setOpenLessons([])
            setLessons([])
            setButtonPlaceHolder([])
        });
        props.navigation.addListener('focus', async () => {
            loadLessonsNamesFromFB();

        });

    }, [])
    return <View style={style.container}>
        <View

            style={{
                alignItems: 'center',
                borderTopRightRadius: WIDTH_OF_SCREEN / 10,
                borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
                backgroundColor: APP_COLOR.screenBackground,
            }}>


            <FlatList
                ListEmptyComponent={<View style={{flex:1,height:HEIGHT_OF_SCREEN}}></View>}
                keyExtractor={(item, index) => "" + index + "" + item.text}
                data={buttonsPlaceHolder}
                renderItem={(item2) => {

                    const item = item2.item;

                    return <View style={{alignItems: 'center'}}>
                        <CustomButton
                            textStyle={{
                                flex: 1,
                                color: !item.visible ? '#acacac' : isNotUndefined(item.type) ? "white" : '#4A65E3',
                                fontWeight: 'bold',
                                fontSize: calculateFontSizeByScreen(15 + props[DEFINITIONS.TEXT_SIZE]),
                                textAlign: 'center',

                            }}
                            onPress={() => {


                                if (item.visible) {
                                    if (item.type == "URL") {
                                        Linking.openURL(item.url).catch(err => console.error("Couldn't load page", err));
                                    } else {
                                        const changes = openLessons;
                                        changes[item2.index] = !changes[item2.index];
                                        setOpenLessons([...changes]);
                                    }

                                } else {
                                    props[SET_STATE]({
                                        [DEFINITIONS.SNACK_BAR]:
                                            {
                                                [DEFINITIONS.SHOW_SNACK_BAR]: true,
                                                [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                                                },
                                                [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.WARNING,
                                                [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'שים לב!',
                                                [DEFINITIONS.TEXT_ON_SNACK_BAR]: 'שיעור זה אינו פתוח לצפייה כרגע.',

                                            }
                                    })
                                }

                            }
                            }
                            style={{
                                ...elevationShadowStyle(3),
                                borderRadius: WIDTH_OF_SCREEN / 15,
                                width: WIDTH_OF_SCREEN / 1.2,
                                backgroundColor: isNotUndefined(item.type) ? '#4A65E3' : APP_COLOR.screenBackground,
                                margin: '5%',
                                height: HEIGHT_OF_SCREEN / 15,
                                alignItems: 'center',
                                paddingHorizontal: '5%',
                                justifyContent: 'space-between'
                            }}
                            iconType={!isNotUndefined(item.type) ? ICON_TYPES.ARROW_DOWN : undefined}
                            text={item.text}/>
                        <View key={"" + item2.index}
                              style={{width: WIDTH_OF_SCREEN / 1.2, alignItems: 'flex-start',}}>
                            {
                                openLessons[item2.index] &&
                                lessons[item2.index].map((item) => {
                                    return item
                                })
                            }
                        </View>
                    </View>
                }}/>

        </View>


    </View>
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCategories)

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main,
    }
})


