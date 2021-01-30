import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import {View, StyleSheet, Text} from "react-native";
import React, {useEffect, useState} from 'react';
import firestore from "@react-native-firebase/firestore";
import {DEFINITIONS} from "../utils";

const CommonQA=(mainProps)=>{

    const [commonQaArray,setCommonQaArray]=useState([]);

    useEffect(()=>{
        firestore().collection(mainProps[DEFINITIONS.COURSE_CODE]).doc("commonQA").get().then((QA)=>{
            setCommonQaArray(QA.data().array);

        })
    },[])

    return <View style={style.container}>

        {
            commonQaArray.map((QA)=>{

                return <View style={{height:100}}>
                    <Text>

                    </Text>
                </View>
            })
        }

    </View>
}

const style=StyleSheet.create({
    container:{
        flex:1,

    }
})

export default connect(mapStateToProps,mapDispatchToProps)(CommonQA)
