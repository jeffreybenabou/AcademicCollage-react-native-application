import React, {useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    Linking,
    Text,
    FlatList,
    SafeAreaView
} from "react-native";

import Clipboard from '@react-native-community/clipboard';

import firestore from '@react-native-firebase/firestore'
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    DEFINITIONS,
    elevationShadowStyle,
    HEIGHT_OF_SCREEN, ICON_TYPES,
    isNotUndefined, SCREEN_NAMES, SetIcon, shuffleArray, TYPE_OF_SNACK_BAR, typeOfComponent,
    WIDTH_OF_SCREEN
} from "../utils";
import {SET_STATE} from "../redux/types";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from "react-native-fast-image";

const AllCategories = (props) => {
    const [lessons, setLessons] = useState([])
    const [openLessons, setOpenLessons] = useState([]);
    const [buttonsPlaceHolder, setButtonPlaceHolder] = useState([]);
    const [didYouKnow, setDidYouKnow] = useState([]);


    const setTheConfigItem = (item) => {
        const lessons = [];
        const buttonsPlaceHolder = [];
        const openLessons2 = [];

        item.map((item) => {

            let objectToRender = [];
            Object.keys(item).sort((a, b) => a > b ? 1 : -1).map((item2) => {

                if (item2.match(/\d/)) {
                    objectToRender.push(  typeOfComponent(item[item2],props,true))
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
        })
        setLessons(lessons);
        setButtonPlaceHolder(buttonsPlaceHolder);
        setOpenLessons(openLessons2);
    }
    const loadLessonsNamesFromFB = async () => {


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
        loadDidYouKnow();

    }, [])
    useEffect(() => {
        props[SET_STATE]({
            [DEFINITIONS.POPUP]: {
                [DEFINITIONS.POPUP_CHILDREN]: () => {
                    const [indexOfDidYouKnow, setIndexOfDidYouKnow] = useState(0);
                    return <View
                        style={{
                            borderRadius: WIDTH_OF_SCREEN / 13,
                            backgroundColor: 'white',
                            width: WIDTH_OF_SCREEN / 1.1,
                        }}>
                        <CustomButton
                            onPress={() => {
                                props[SET_STATE]({
                                    [DEFINITIONS.POPUP]: {
                                        [DEFINITIONS.POPUP_VISIBLE]: false
                                    }
                                })
                            }
                            }
                            iconType={ICON_TYPES.CLOSE} iconSize={WIDTH_OF_SCREEN / 120}

                            style={{
                                position: 'absolute',
                                top: WIDTH_OF_SCREEN / 30,
                                zIndex: 100,


                                right: WIDTH_OF_SCREEN / 30
                            }}/>

                        <Text
                            style={{

                                paddingTop: '6%',

                                textAlign: 'center',
                                fontSize: calculateFontSizeByScreen(20),
                                fontWeight: 'bold',
                                color: APP_COLOR.main,
                            }}>הידעת?</Text>
                        <Text style={{
                            textAlign:'left',
                            padding: '6%',
                            fontSize: calculateFontSizeByScreen(15),

                        }}>{didYouKnow[indexOfDidYouKnow]}</Text>
                        <View style={{
                            padding: '6%',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',

                        }}>
                            <CustomButton
                                onPress={() => {
                                    setIndexOfDidYouKnow((indexOfDidYouKnow) > 0 ? indexOfDidYouKnow - 1 : indexOfDidYouKnow)
                                }
                                }

                                textStyle={{
                                    fontWeight: 'bold',
                                    fontSize: calculateFontSizeByScreen(14),
                                    color: 'white',
                                }}
                                iconType={ICON_TYPES.ARROW_DOWN}
                                style={{
                                    transform: [
                                        {rotate: '-90deg'},
                                    ],

                                }}/>

                            <Text style={{
                                color: 'black',
                                fontSize: calculateFontSizeByScreen(12),

                            }}>{indexOfDidYouKnow + 1}/{didYouKnow.length}</Text>
                            <CustomButton
                                onPress={() => {
                                    setIndexOfDidYouKnow((indexOfDidYouKnow + 1) < didYouKnow.length ? indexOfDidYouKnow + 1 : indexOfDidYouKnow)
                                }
                                }

                                iconType={ICON_TYPES.ARROW_DOWN}

                                style={{
                                    transform: [


                                        {rotate: '90deg'},


                                    ],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}/>


                        </View>

                        <CustomButton
                            onPress={() => {
                                props[SET_STATE]({
                                    [DEFINITIONS.POPUP]: {
                                        [DEFINITIONS.POPUP_VISIBLE]: false
                                    }
                                })
                            }
                            }
                            text={"הבנתי"}
                            textStyle={{
                                fontWeight: 'bold',
                                fontSize: calculateFontSizeByScreen(14),
                                color: 'white',
                            }}

                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: calculateFontSizeByScreen(20),
                                fontWeight: 'bold',
                                minHeight: HEIGHT_OF_SCREEN / 15,
                                borderRadius: WIDTH_OF_SCREEN / 13,
                                borderTopRightRadius: 0,
                                borderTopLeftRadius:0,

                                backgroundColor: APP_COLOR.main
                            }}/>

                    </View>
                },
                [DEFINITIONS.POPUP_VISIBLE]: true

            }

        })
    }, [didYouKnow])

    const loadDidYouKnow = () => {
        firestore().collection(props[DEFINITIONS.COURSE_CODE]).doc("didYouKnow").get().then((test) => {
            const didYouKnow = [];
            Object.keys(test.data()).map((item) => {
                didYouKnow.push(test.data()[item])
            })

            setDidYouKnow(shuffleArray(didYouKnow))
        })
    }
    return <View style={style.container}>
        <View

            style={{
                alignItems: 'center',
                borderTopRightRadius: WIDTH_OF_SCREEN / 10,
                borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
                backgroundColor: APP_COLOR.screenBackground,
            }}>


            <FlatList
                ListEmptyComponent={<View style={{flex: 1, height: HEIGHT_OF_SCREEN}}></View>}
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
                                borderRadius: WIDTH_OF_SCREEN / 10,
                                width: WIDTH_OF_SCREEN / 1.1,
                                backgroundColor: isNotUndefined(item.type) ? '#4A65E3' : 'white',
                                marginTop: '4%',
                                minHeight: HEIGHT_OF_SCREEN / 15,
                                alignItems: 'center',
                                paddingHorizontal: '5%',
                                justifyContent: 'space-between',
                                margin: '1%'
                            }}
                            iconType={!isNotUndefined(item.type) ?openLessons[item2.index]?ICON_TYPES.ARROW_UP: ICON_TYPES.ARROW_DOWN : undefined}
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


