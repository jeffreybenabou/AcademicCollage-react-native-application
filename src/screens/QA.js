import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    View,
    StyleSheet,
    Modal,
    FlatList,
    Text,
    Image,
    Platform,
    TouchableOpacity,
    Alert,
    SafeAreaView, Button
} from "react-native";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'; // 1
import Carousel from 'react-native-snap-carousel';
import ImageZoom from 'react-native-image-pan-zoom'
import {
    APP_COLOR,
    calculateFontSizeByScreen,
    CustomButton,
    CustomInput, DEFINITIONS, elevationShadowStyle,
    HEIGHT_OF_SCREEN, ICON_TYPES, requestPermission, SetIcon, TYPE_OF_SNACK_BAR,
    WIDTH_OF_SCREEN
} from "../utils";
import {utils, Utils} from "@react-native-firebase/app";
import {SET_STATE} from "../redux/types";
import {PERMISSIONS} from "react-native-permissions";
import ImagePicker from 'react-native-image-crop-picker';
import Pagination from "react-native-snap-carousel";
import FastImage from "react-native-fast-image";
import functions from "@react-native-firebase/functions";


class QA extends React.Component {

    state = {
        messageValue: '',
        generalMessages: [],
        courseMessages: [],
        currentPickChat: 0,
        images: [],
        showImageModal: false,
        currentImageOnModal: '',
        messageIsSending:false

    }

    flatListRef = {};


    componentDidMount() {

        firestore()
            .collection(this.props[DEFINITIONS.COURSE_CODE])
            .doc("courseMessages")
            .onSnapshot(
                (object) => {
                    const courseMessages = [];

                    try {
                        Object.keys(object.data()).sort().map((item2) => {
                            courseMessages.push(object.data()[item2])
                        })
                    } catch (e) {
                        console.log(e)
                    }



                    this.setState({
                        courseMessages
                    })


                },
                () => {


                });
        firestore()
            .collection(this.props[DEFINITIONS.COURSE_CODE])
            .doc("generalMessages")
            .onSnapshot(
                (object) => {
                    const generalMessages = [];
                    try {
                        Object.keys(object.data()).sort().map((item2) => {
                            generalMessages.push(object.data()[item2])
                        })
                    } catch (e) {
                        console.log(e)
                    }

                    this.setState({
                        generalMessages
                    })



                },
                () => {

                });
    }


    render() {
        return <View style={style.container}>
            <View style={{
                flex: 1, borderTopRightRadius: WIDTH_OF_SCREEN / 10,
                borderTopLeftRadius: WIDTH_OF_SCREEN / 10, backgroundColor: APP_COLOR.screenBackground,
            }}>
                {
                    this.FlatListHeader()
                }
                {
                    this.ChatFlatList()
                }
            </View>


        </View>
    }

    FlatListItem = (props) => (
        <View style={{marginBottom: '2.5%', backgroundColor: APP_COLOR.QABackground}}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <FastImage
                    source={{uri: props.item.img}}
                    style={{
                        margin: '5%',
                        height: WIDTH_OF_SCREEN / 6,
                        borderColor: 'gray',
                        borderWidth: 0.2,
                        width: WIDTH_OF_SCREEN / 6,
                        borderRadius: WIDTH_OF_SCREEN / 6 / 2,

                        backgroundColor: 'white'
                    }}
                    resizeMode={'contain'}
                />
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        fontSize: calculateFontSizeByScreen(16 + this.props[DEFINITIONS.TEXT_SIZE]),
                        color: '#424242'
                    }}>{props.item.name}</Text>
                    <Text style={{
                        textAlign: 'left',
                        fontSize: calculateFontSizeByScreen(14 + this.props[DEFINITIONS.TEXT_SIZE]),
                        color: '#424242'
                    }}>{props.item.date}</Text>
                </View>


            </View>
            <Text
                style={{
                    textAlign: 'left',
                    margin: '5%',
                    marginVertical: 0,
                    fontSize: calculateFontSizeByScreen(14 + this.props[DEFINITIONS.TEXT_SIZE])

                }}>{props.item.text}</Text>
            <Carousel loop={true}
                      data={props.item.images}
                      renderItem={this.CarouselItem}
                      sliderWidth={WIDTH_OF_SCREEN}
                      itemWidth={WIDTH_OF_SCREEN / 1.2}
            />

        </View>
    )


    sendNotification = async (title, body, imagePath) => {


        const data = {
            topic: this.props[DEFINITIONS.COURSE_CODE],
            title: title,
            body: body,
            image: imagePath
        }
        this.setState({
            messageIsSending:false,
            messageValue:''
        })
        console.log("message before",data)

        /*  if(__DEV__)
          functions().useFunctionsEmulator('http://localhost:5001');*/
        functions()
            .httpsCallable('FCMByTopic')(data)
            .then(response => {
                console.log("response", response)
            }).catch((e) => {
            console.log("error", JSON.stringify(e))
        });
    }
    FlatListHeader = () => {


        return <View style={{
            borderTopLeftRadius: WIDTH_OF_SCREEN / 10,
            borderTopRightRadius: WIDTH_OF_SCREEN / 10,
            alignSelf: 'center',
            width: WIDTH_OF_SCREEN / 1.1
        }}>
            <View style={{
                width: WIDTH_OF_SCREEN / 1.2,
                height: HEIGHT_OF_SCREEN / 15,
                justifyContent: 'space-between',
                flexDirection: 'row'
            }}>
                <CustomButton
                    onPress={() => {
                        this.setState({
                            currentPickChat: 0
                        })

                    }}
                    textStyle={{
                        fontWeight: this.state.currentPickChat === 0 ? 'bold' : undefined,
                        fontSize: calculateFontSizeByScreen(16),
                        color: this.state.currentPickChat === 0 ? APP_COLOR.main : 'gray',
                        paddingBottom: this.state.currentPickChat === 0 ? '2%' : 0
                    }}
                    style={{

                        borderBottomWidth: this.state.currentPickChat === 0 ? 1 : 0,
                        borderColor: APP_COLOR.iconColor
                    }}
                    text={"שאלות בנושא השיעור"}
                />
                <CustomButton
                    textStyle={{
                        fontSize: calculateFontSizeByScreen(16),
                        color: this.state.currentPickChat === 1 ? APP_COLOR.main : 'gray',
                        paddingBottom: this.state.currentPickChat === 1 ? '2%' : 0,
                        fontWeight: this.state.currentPickChat === 1 ? 'bold' : undefined

                    }}
                    style={{
                        borderColor: APP_COLOR.iconColor,
                        borderBottomWidth: this.state.currentPickChat === 1 ? 1 : 0
                    }}
                    onPress={() => {
                        this.setState({
                            currentPickChat: 1
                        })


                    }}
                    text={"שאלות כלליות"}
                />
            </View>
            <View style={{marginVertical: '5%', justifyContent: 'space-between', flexDirection: 'row',}}>
                <CustomInput
                    multiline={true}
                    actionOnIconPress={() => {

                        if (Platform.OS == "android" ? requestPermission(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : requestPermission(PERMISSIONS.IOS.PHOTO_LIBRARY)) {
                            ImagePicker.openPicker({
                                multiple: true,
                                compressImageMaxWidth: 1000,
                                compressImageMaxHeight: 1000,
                                mediaType: 'photo',
                            }).then(images => {
                                const imagesPath = [];
                                images.map(async (item) => {
                                    imagesPath.push(item.path)

                                })

                                this.setState({
                                    images: imagesPath
                                })



                            });


                        }

                    }}
                    iconSize={WIDTH_OF_SCREEN / 80}
                    iconType={ICON_TYPES.COPY}
                    onChangeText={(messageValue) => {
                        this.setState({
                            messageValue
                        })

                    }}
                    placeholder={"הזן טקסט"}
                    value={this.state.messageValue}
                    textStyle={{
                        textAlign: 'right',
                        flex: 1,
                    }}
                    style={{
                        flexDirection: 'row-reverse',
                        paddingHorizontal: '5%',
                        backgroundColor: 'white',
                        borderRadius: WIDTH_OF_SCREEN / 10,
                        flex: 1,
                        ...elevationShadowStyle(3),
                        marginStart: '5%'
                    }}/>
                <CustomButton
                    disabled={this.state.messageIsSending}
                    showLoader={this.state.messageIsSending}
                    iconSize={WIDTH_OF_SCREEN / 100}
                    style={{
                        alignItems: 'center',
                        ...elevationShadowStyle(3),
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        height: HEIGHT_OF_SCREEN / 15,
                        width: HEIGHT_OF_SCREEN / 15,
                        borderRadius: HEIGHT_OF_SCREEN / 15 / 2
                    }}
                    onPress={() => {
                        console.log("ASfasfasfsafasfsaffasasfafssfa")
                        if (this.state.messageValue.length > 0) {
                            this.setState({
                                messageIsSending:true
                            })
                            const date = new Date();
                            const objectToAdd = {
                                [date.getTime()]: {
                                    images: [],
                                    text: this.state.messageValue,
                                    id: date.getTime(),
                                    name: this.props[DEFINITIONS.USER][DEFINITIONS.USER_NAME],
                                    img: this.props[DEFINITIONS.USER][DEFINITIONS.USER_IMAGE],
                                    email: this.props[DEFINITIONS.USER][DEFINITIONS.USER_EMAIL],
                                    date: date.getDay() + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
                                }

                            }
                            let send = false;
                            this.state.images.map(async (item, index) => {
                                let reference = storage().ref(date.getTime() + "/" + index);

                                let task = reference.putFile(item);


                                task.then(async () => {
                                    const ref = await storage()
                                        .ref(date.getTime() + "/" + index)
                                        .getDownloadURL();

                                    if (!send) {
                                        send = true;
                                        this.sendNotification("הודעה מאת- " + this.props[DEFINITIONS.USER][DEFINITIONS.USER_NAME], this.state.messageValue, ref);
                                    }

                                    objectToAdd[date.getTime()].images.push(ref)
                                    await firestore()
                                        .collection(this.props[DEFINITIONS.COURSE_CODE])
                                        .doc(this.state.currentPickChat === 0 ? "courseMessages" : 'generalMessages')
                                        .update(objectToAdd)
                                    console.log('Image uploaded to the bucket!');
                                }).catch((e) => console.log('uploading image error => ', e));
                            })
                            console.log(this.state.messageValue)

                            firestore()
                                .collection(this.props[DEFINITIONS.COURSE_CODE])
                                .doc(this.state.currentPickChat === 0 ? "courseMessages" : 'generalMessages')
                                .update(objectToAdd).then(()=>{
                                if (this.state.images.length == 0)
                                    this.sendNotification("הודעה מאת- " + this.props[DEFINITIONS.USER][DEFINITIONS.USER_NAME], this.state.messageValue, "");


                            });
                        } else {
                            this.props[SET_STATE]({
                                [DEFINITIONS.SNACK_BAR]:
                                    {
                                        [DEFINITIONS.SHOW_SNACK_BAR]: true,
                                        [DEFINITIONS.ACTION_ON_SNACK_BAR]: () => {
                                        },
                                        [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.WARNING,
                                        [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'שים לב!',
                                        [DEFINITIONS.TEXT_ON_SNACK_BAR]: 'לפני שליחת הודעה חובה להזין טקסט',

                                    }
                            })
                        }

                    }}
                    iconType={ICON_TYPES.LEFT}
                />
            </View>
        </View>
    }
    keyExtractor = (item) => item.id;

    ChatFlatList = (chatProps) => {


        return <FlatList
            style={{width:'100%'}}
            ref={(ref)=>this.flatListRef=ref}
            keyExtractor={this.keyExtractor}
            data={this.state.currentPickChat === 0 ? this.state.courseMessages : this.state.generalMessages}
            ListEmptyComponent={this.FlatListEmpty}
            renderItem={this.FlatListItem}
        />

    }

    FlatListEmpty = ()=>{
        return  <View
            style={{
                alignItems: 'center',
                marginTop: HEIGHT_OF_SCREEN / 8
            }}>
            <Text
                style={{
                    fontSize: calculateFontSizeByScreen(20 + this.props[DEFINITIONS.TEXT_SIZE]),
                    marginBottom: '5%',
                }}>אין הודעות בקטגוריה זו</Text>
            <LottieView style={{height: HEIGHT_OF_SCREEN / 4}}
                        source={require('../../res/animation/empty_message.json')} autoPlay loop/>
        </View>
    }


    CarouselItem = (props) => ( <TouchableOpacity
            onPress={() => {
                this.setState({
                    currentImageOnModal: props.item,
                    showImageModal: true
                })

            }}>
            {
                <Modal
                    animationType="slide"
                    animated={true}
                    presentationStyle={"fullScreen"}
                    visible={this.state.showImageModal}
                >
                    <SafeAreaView>
                        <TouchableOpacity onPress={() => {


                            this.setState({
                                showImageModal: false
                            })
                        }}>
                            <SetIcon iconSize={20} iconType={ICON_TYPES.CLOSE}/>
                        </TouchableOpacity>
                        <ImageZoom
                            cropHeight={HEIGHT_OF_SCREEN / 3}
                            cropWidth={WIDTH_OF_SCREEN}
                            imageWidth={WIDTH_OF_SCREEN}
                            imageHeight={HEIGHT_OF_SCREEN / 3}>
                            <FastImage

                                resizeMode={"contain"}
                                style={{width: WIDTH_OF_SCREEN, height: HEIGHT_OF_SCREEN / 3}}
                                source={{
                                    cache: FastImage.cacheControl.web,
                                    uri: this.state.currentImageOnModal,
                                }}/>
                        </ImageZoom>

                        {/*  <CustomInput
                            actionOnIconPress={()=>{}}
                            iconSize={10}
                            textStyle={{
                                flex:1,
                                textAlign:'right',

                            }}
                            style={{
                                alignSelf:'center',
                                height:HEIGHT_OF_SCREEN/15,
                                borderRadius:HEIGHT_OF_SCREEN/30,
                                width:'95%',
                                paddingHorizontal:'5%',
                                backgroundColor:'white',
                                ...elevationShadowStyle(3),
                                flexDirection:'row-reverse'}}
                            iconType={ICON_TYPES.LEFT}
                            placeholder={"הזן טקסט"} value={""}/>*/}


                    </SafeAreaView>


                </Modal>
            }

            <FastImage
                resizeMode={"contain"}
                style={{height:HEIGHT_OF_SCREEN/3,width:'100%'}}
                source={{uri: props.item}}
            />
        </TouchableOpacity>)

}




export default connect(mapStateToProps, mapDispatchToProps)(QA);


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.main,
    }
})


