import React, {useEffect, useRef, useState} from "react";
import {View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView, Platform} from "react-native";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    CustomInput, DEFINITIONS,
    elevationShadowStyle,
    HEIGHT_OF_SCREEN,
    ICON_TYPES, TYPE_OF_SNACK_BAR,
    WIDTH_OF_SCREEN
} from "../utils";
import firestore from '@react-native-firebase/firestore'
import {SET_STATE} from "../redux/types";

export const HomeWorkAndSolution = (HomeWorkAndSolutionProps) => {
    const [value, setValue] = useState('');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [firstInit, setFirstInit] = useState(true);
    const [homeWorkObject, setHomeWorkObject] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef()
    useEffect(()=>{
        if(firstInit&&filteredData.length>0){
            console.log("filteredData.length",filteredData.length)
            setCurrentIndex(filteredData.length-1)
            setFirstInit(false)
        }

    },[filteredData])
    useEffect(() => {
        HomeWorkAndSolutionProps.navigation.addListener('blur', (e) => {
            setFilteredData([])
            setData([])
            setFilteredData([])
            setHomeWorkObject({})
        });
        HomeWorkAndSolutionProps.navigation.addListener('focus', async () => {
            loadDataFromFireBase();

        });

        loadDataFromFireBase();
        /* firestore()
            .collection("androidHomeWork")
            .get()
            .then((lessons) => {

                let a= {};
                lessons.docs.map((item,index)=>{
                    a={...a,[index<9?index:"9"+index]:item.data()}
                })
                firestore()
                    .collection("android2020").doc("homeWork").set(a)

            })*/
    }, []);


    const loadDataFromFireBase = () => {
        firestore()
            .collection(HomeWorkAndSolutionProps[DEFINITIONS.COURSE_CODE]).doc("homeWork").get().then((items) => {
            const filteredData = [];


            Object.keys(items.data()).map((info, index) => {
                if (index === Object.keys(items.data()).length - 1) {
                    setHomeWorkObject(items.data()[info].information);
                }
                filteredData.push(items.data()[info])

            })

            setFilteredData(filteredData);
            setData(filteredData);


        })
    }
    const RenderItem = (itemProps) => {

        return <CustomButton
            onPress={() => {
                setHomeWorkObject(filteredData[itemProps.index].information);
                setCurrentIndex(itemProps.index);

            }}
            text={itemProps.item.titleOfWork}
            textStyle={{

                textAlign: 'center',
                color: 'white',

                fontSize: calculateFontSizeByScreen(14 + HomeWorkAndSolutionProps[DEFINITIONS.TEXT_SIZE])
            }}


            style={{

                borderColor: currentIndex == itemProps.index ? "black" : 'transparent',
                borderRadius: HEIGHT_OF_SCREEN / 30,
                marginEnd: WIDTH_OF_SCREEN / 30,
                borderWidth: 1,
                padding: WIDTH_OF_SCREEN / 30,
                backgroundColor: APP_COLOR.main,
            }}

        />
    }
    const keyExtractor = (item, index) => "" + index;
    return <View style={style.container}>
        <View style={{
            flex: 1, borderTopRightRadius: WIDTH_OF_SCREEN / 10,
            borderTopLeftRadius: WIDTH_OF_SCREEN / 10, backgroundColor: APP_COLOR.screenBackground,
        }}>
            <CustomInput
                value={value}
                textStyle={{
                    flex: 1,
                    textAlign: 'right',
                    color: 'black',
                    paddingStart: WIDTH_OF_SCREEN / 25,
                    fontSize: calculateFontSizeByScreen(14 + HomeWorkAndSolutionProps[DEFINITIONS.TEXT_SIZE])
                }}
                onChangeText={(value) => {
                    setValue(value);
                    const searchResult = data.filter((item) => {
                        return item.title.includes(value) || item.titleOfWork.includes(value) || item.subTitle.includes(value)
                    })
                    setFilteredData(searchResult)

                }}

                style={{
                    flexDirection: 'row-reverse',
                    margin: '5%',
                    height: HEIGHT_OF_SCREEN / 15,
                    borderRadius: HEIGHT_OF_SCREEN / 30,
                    paddingStart: '5%',
                    ...elevationShadowStyle(3), backgroundColor: 'white'
                }}

                iconType={ICON_TYPES.SEARCH}
                actionOnIconPress={() => {

                }}
                placeholder={"חפש תרגיל"}/>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
                {
                    filteredData.length>0&&
                    <FlatList
                        onContentSizeChange={(e) => {

                            flatListRef.current.scrollToOffset({offset:Platform.OS==="android"?-e: e})
                        }}
                        ref={flatListRef}
                        keyExtractor={keyExtractor}
                        style={{marginHorizontal: '5%'}}
                        horizontal={true}
                        data={filteredData}
                        renderItem={RenderItem} snapToAlignment={"end"}
                    />

                }


            </View>
            <View style={{
                flex: 7,
                backgroundColor: 'white',
                margin: '5%',
                borderRadius: HEIGHT_OF_SCREEN / 30, ...elevationShadowStyle(3)
            }}>
                <ScrollView style={{
                    margin: HEIGHT_OF_SCREEN / 80,
                    marginBottom: HEIGHT_OF_SCREEN / 15 + HEIGHT_OF_SCREEN / 80,
                }}>
                    {
                        Object.values(homeWorkObject).map((item) => {
                            if (item.includes("%b%")) {

                                return <Text
                                    style={{
                                        textAlign: 'left',
                                        padding: '2%',
                                        fontSize: calculateFontSizeByScreen(14 + HomeWorkAndSolutionProps[DEFINITIONS.TEXT_SIZE])
                                    }}>{item.replace("%b%", "")}</Text>
                            } else {
                                return <Text style={{
                                    fontSize: calculateFontSizeByScreen(14 + HomeWorkAndSolutionProps[DEFINITIONS.TEXT_SIZE]),
                                    textAlign: 'left',
                                    paddingHorizontal: '2%'
                                }}>{item.replace(/~/g, "\n")}</Text>

                            }
                        })
                    }

                </ScrollView>
                <CustomButton
                    textStyle={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: calculateFontSizeByScreen(14 + HomeWorkAndSolutionProps[DEFINITIONS.TEXT_SIZE])
                    }}
                    onPress={() => {
                        HomeWorkAndSolutionProps[SET_STATE]({
                            [DEFINITIONS.SNACK_BAR]:
                                {
                                    [DEFINITIONS.SHOW_SNACK_BAR]: true,
                                    [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                                    },
                                    [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.WARNING,
                                    [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'שים לב!',
                                    [DEFINITIONS.TEXT_ON_SNACK_BAR]: 'פתרון לתרגיל זה אינו זמין כרגע.',

                                }
                        })
                    }}

                    text={"פתרון התרגיל"}
                    style={style.solutionButton}
                />


            </View>
        </View>

    </View>
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkAndSolution);


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main,
    },
    solutionButton: {
        borderBottomRightRadius: HEIGHT_OF_SCREEN / 30,
        borderBottomLeftRadius: HEIGHT_OF_SCREEN / 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: APP_COLOR.main,

        height: HEIGHT_OF_SCREEN / 15,
        width: '100%',
    }

})
