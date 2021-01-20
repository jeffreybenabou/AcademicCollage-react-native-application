import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, Switch, BackHandler} from "react-native";
import {connect} from "react-redux";
import {Slider} from "@miblanchard/react-native-slider";


import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import {
    APP_COLOR,
    calculateFontSizeByScreen, CustomButton,
    DEFINITIONS, elevationShadowStyle,
    HEIGHT_OF_SCREEN,
    storeData,
    WIDTH_OF_SCREEN
} from "../utils";
import {SET_STATE} from "../redux/types";

const Settings = (mainProps) => {

    const [valueOnSlider, setValueOnSlider] = useState(mainProps[DEFINITIONS.TEXT_SIZE]);
    useEffect(()=>{
        mainProps.navigation.addListener('blur', (e) => {
            BackHandler.removeEventListener('hardwareBackPress');

        });
        mainProps.navigation.addListener('focus', async (e) => {

            BackHandler.addEventListener('hardwareBackPress', () => {
                mainProps.navigation.goBack();
                mainProps[SET_STATE]({
                    [DEFINITIONS.TEXT_ON_HEADER]:'מערך שיעור'
                })
                return true;

            });



        });
    },[])

    return <View style={style.container}>
        <View style={{
            flex: 1,
            borderTopRightRadius: WIDTH_OF_SCREEN / 10,
            borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
            backgroundColor: APP_COLOR.screenBackground,
            alignItems: 'flex-start',

        }}>

            <Text style={{fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE]), margin: '5%'}}>
                הגדרות כלליות
            </Text>
            <View style={{
                borderRadius: WIDTH_OF_SCREEN / 20, ...elevationShadowStyle(3),
                backgroundColor: 'white',
                padding: '5%',
                width: '85%',
                justifyContent: 'center',
                alignSelf: 'center'
            }}>
                <Text style={{
                    textAlign: 'left',
                    fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE]),
                }}>
                    גודל פונט
                </Text>
                <View
                    style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
                    <Text style={{

                        fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE])
                    }}>-</Text>
                    <Text style={{

                        fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE])
                    }}>+</Text>

                </View>
                <Slider

                    step={1}
                    allowTouchTrack={true}
                    value={valueOnSlider}
                    onValueChanged={(item) => {

                    }}
                    onValueChange={(item)=>{
                        console.log(item)

                        setValueOnSlider(item[0])
                        mainProps[SET_STATE]({
                            [DEFINITIONS.TEXT_SIZE]: item[0]
                        })
                        storeData([DEFINITIONS.TEXT_SIZE], "" + item[0])
                    }}


                    minimumValue={0}
                    maximumValue={10}
                    minimumTrackTintColor={APP_COLOR.main}
                    maximumTrackTintColor={APP_COLOR.screenBackground}
                    thumbTintColor={APP_COLOR.main}
                />

            </View>


        </View>
    </View>
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main,
    }
})

