import React, {useState} from "react";
import {View, StyleSheet, Text, Switch} from "react-native";
import {connect} from "react-redux";
import Slider from '@react-native-community/slider';

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
    const [pushLessons, setPushLessons] = useState(false);
    const [generalLessons, setGeneralLessons] = useState(false);

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
            <View style={{borderRadius:WIDTH_OF_SCREEN/20,...elevationShadowStyle(3),backgroundColor:'white',padding:'5%',width:'85%',justifyContent:'center',alignSelf:'center'}}>
                <Text style={{textAlign:'left',fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE]),}}>
                    גודל פונט
                </Text>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
                    <Text style={{

                        fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE])
                    }}>+</Text>
                    <Text style={{

                        fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE])
                    }}>-</Text>

                </View>
                <Slider
                    inverted={true}
                    step={1}
                    value={valueOnSlider}
                    onValueChange={(item) => {
                        mainProps[SET_STATE]({
                            [DEFINITIONS.TEXT_SIZE]: item
                        })
                        storeData([DEFINITIONS.TEXT_SIZE], "" + item)

                    }}
                    style={{

                    }}
                    minimumValue={0}
                    maximumValue={10}
                    minimumTrackTintColor={APP_COLOR.main}
                    maximumTrackTintColor={APP_COLOR.screenBackground}
                />

            </View>
            {/*<Text style={{fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE]), margin: '5%'}}>
                הגדרות משתמש
            </Text>
            <View style={{borderRadius:WIDTH_OF_SCREEN/20,...elevationShadowStyle(3),backgroundColor:'white',padding:'5%',width:'85%',justifyContent:'center',alignSelf:'center'}}>
                <Text style={{textAlign:'left',fontSize: calculateFontSizeByScreen(16 + mainProps[DEFINITIONS.TEXT_SIZE]),}}>
                    הסרת פרטים ומחיקת משתמש
                </Text>
                <CustomButton
                    style={{
                        marginTop:HEIGHT_OF_SCREEN/50,
                        height:HEIGHT_OF_SCREEN/15,
                        backgroundColor:APP_COLOR.main,
                        borderRadius:WIDTH_OF_SCREEN/50
                    }}
                    textStyle={{
                        fontSize:calculateFontSizeByScreen(16+mainProps[DEFINITIONS.TEXT_SIZE]),
                        color:'white',
                        margin:WIDTH_OF_SCREEN/50

                    }}
                    text={"מחק משתמש"}
                />
            </View>*/}

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

