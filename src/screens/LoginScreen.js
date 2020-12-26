import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/AppReducer";
import React, {useEffect, useState} from "react";
import {View, StyleSheet, Image, Text, TextInput, Alert, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import {AccessToken,GraphRequestManager, GraphRequest, LoginManager} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import firestore from '@react-native-firebase/firestore'
import {
    APP_COLOR, calculateFontSizeByScreen,
    CustomButton,
    CustomInput, DEFINITIONS,
    elevationShadowStyle,
    HEIGHT_OF_SCREEN,
    ICON_TYPES, isNotUndefined, storeData, TYPE_OF_SNACK_BAR,
    WIDTH_OF_SCREEN
} from "../utils";
import Tooltip from "rn-tooltip";
import {SET_STATE} from "../redux/types";
import {firebase} from "@react-native-firebase/firestore";
import appleAuth from "@invertase/react-native-apple-authentication";


const LoginScreen = (props) => {

    const [courseCode, setCourseCode] = useState("");
    const [user,setUser]=useState(null);
    const [currentLoginMethod, setCurrentLoginMethod] = useState(null);

    useEffect(()=>{
        onAuthStateChanged();
    },[user])
    useEffect(() => {

            GoogleSignin.configure({
                webClientId: '639569907370-5l0lt7r9isk0q72r3krf73la975sd0h8.apps.googleusercontent.com', // From Firebase Console Settings
            });






    }, [])



    const onAuthStateChanged =async () => {

        if (isNotUndefined(user)) {

            firestore().collection(courseCode).get().then(async (exist)=>{

                 await  storeData([DEFINITIONS.COURSE_CODE],courseCode)
            await  storeData([DEFINITIONS.USER_NAME],user.name)
            await  storeData([DEFINITIONS.USER_EMAIL],user.email)
            await storeData([DEFINITIONS.USER_IMAGE],user.picture)
            props[SET_STATE]({
                [DEFINITIONS.COURSE_CODE]:courseCode,
                [DEFINITIONS.IS_LOG_IN]: true,
                [DEFINITIONS.USER]:
                    {
                        [DEFINITIONS.USER_NAME]:user.name,
                        [DEFINITIONS.USER_EMAIL]:user.email,
                        [DEFINITIONS.USER_IMAGE]:user.picture
                    }
            })

            }).catch(()=>{

                auth().signOut();
                props[SET_STATE]({
                    [DEFINITIONS.SNACK_BAR]: {
                        [DEFINITIONS.SHOW_SNACK_BAR]: true,
                        [DEFINITIONS.TEXT_ON_SNACK_BAR]: 'קורס זה אינו קיים, נסה שוב עם מספר קורס אחר.',
                        [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'שים לב !',
                        [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.ERROR,

                    }
                })
            })


        }

    }
    const appleLogin=async ()=>{

        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        }).then(()=>{

        }).catch(()=>{

        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw 'Apple Sign-In failed - no identify token returned';
        }

        // Create a Firebase credential from the response
        const {identityToken, nonce} = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);



        // Sign the user in with the credential
        return auth().signInWithCredential(appleCredential).then((respone) => {

            const user_={
                name:respone.additionalUserInfo.profile.name,
                email:respone.additionalUserInfo.profile.email,
                picture:''
            }

            setUser(user_)
        }).catch((response) => {


        });
    }
    const FacebookLogin = async () => {
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);


        auth().signInWithCredential(facebookCredential).catch((e) => {




        }).then((user) => {
            const infoRequest = new GraphRequest(
                '/me?fields=picture.type(large)',
                null,
                (error, result) => {
                    const user_={
                        name:user.additionalUserInfo.profile.name,
                        email:user.additionalUserInfo.profile.email,
                        picture:''
                    }
                    if (error) {


                        setUser(user_)
                        console.log('Error fetching data: ' + JSON.stringify(error));
                    } else {
                        user_.picture=result.picture.data.url;

                        setUser(user_)
                        /* setPictureURL(result.picture.data.url);
                         setPictureURLByID(
                             `https://graph.facebook.com/${result.id}/picture`,
                         );*/
                    }
                },
            );
            new GraphRequestManager().addRequest(infoRequest).start();



        });
    }
    const GmailLogin = async () => {
        const {idToken} = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential

        auth().signInWithCredential(googleCredential).then((response) => {


            const user_={
               name:response.additionalUserInfo.profile.name,
                picture:response.additionalUserInfo.profile.picture,
                email:response.additionalUserInfo.profile.email,
            }
            setUser(user_)

        }).catch((e) => {
            console.log(e);

        });
    }

    return <View style={style.container}>

        {
            props[DEFINITIONS.KEYBOARD_HEIGHT]==0&&
            <View style={{flex: 1}}>
                <Image style={style.logo} resizeMode={'contain'} source={require('../../res/images/logo.png')}/>
            </View>
        }


        <View style={{flex: 1.5, marginTop: '5%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>

                <Text
                    style={{
                        color: APP_COLOR.main,
                        fontSize:calculateFontSizeByScreen(14+props[DEFINITIONS.TEXT_SIZE])
                    }}
                > הזן קוד קורס למטה</Text>
                <Tooltip
                    containerStyle={{right:WIDTH_OF_SCREEN/5,position:'absolute',alignSelf:'center',height: 'auto', width: '50%'}}
                         popover={
                             <Text
                             style={{
                                 color: 'white',
                                 flex: 1,
                                 fontSize:calculateFontSizeByScreen(14+props[DEFINITIONS.TEXT_SIZE]),
                                 textAlign: 'center'
                             }}>יש לפנות אל המרצה שלכם על
                             מנת לקבל קוד קורס</Text>}>
                    <Text> (?) </Text>
                </Tooltip>
            </View>


            <CustomInput
                value={courseCode}
                placeholder={"קוד קורס"}
                onChangeText={(value) => {
                    setCourseCode(value)

                }}
                iconType={ICON_TYPES.USER_NAME}
                style={style.input}
            />
            <Text
                style={{color: APP_COLOR.main, alignSelf: 'flex-start', marginVertical: '5%'}}>
                בחר אמצעי התחברות</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%'}}>
                <CustomButton
                    onPress={() => {
                        setCurrentLoginMethod(1)
                    }}

                    iconType={ICON_TYPES.FACEBOOK}
                    textStyle={{textAlign: 'center', color: 'white'}}
                    style={[style.sendButton, style.socialLogin, {
                        borderWidth: currentLoginMethod === 1 ? 1 : 0,
                        borderColor: APP_COLOR.iconColor,
                        marginEnd: '5%',
                    }]}
                />


                <CustomButton
                    onPress={() => {
                        setCurrentLoginMethod(2)
                    }}
                    iconType={ICON_TYPES.GMAIL}
                    textStyle={{textAlign: 'center', color: 'white'}}
                    style={[style.sendButton, style.socialLogin, {
                        borderWidth: currentLoginMethod === 2 ? 1 : 0,
                        borderColor: APP_COLOR.iconColor
                    }]}/>
                {
                    Platform.OS=="ios"&&
                    <CustomButton
                        onPress={() => {
                            setCurrentLoginMethod(3)
                        }}
                        iconType={ICON_TYPES.APPLE}
                        textStyle={{textAlign: 'center', color: 'white'}}
                        style={[style.sendButton, style.socialLogin, {
                            marginStart: '5%',
                            borderWidth: currentLoginMethod ===3 ? 1 : 0,
                            borderColor: APP_COLOR.iconColor
                        }]}/>
                }

            </View>
            <CustomButton
                onPress={() => {
                    if (currentLoginMethod && courseCode.length > 0) {
                        if (currentLoginMethod === 1) {
                            FacebookLogin()
                        } else if(currentLoginMethod===2){
                            GmailLogin();
                        }else
                            appleLogin();

                    } else {
                        props[SET_STATE]({
                            [DEFINITIONS.SNACK_BAR]: {
                                [DEFINITIONS.SHOW_SNACK_BAR]: true,
                                [DEFINITIONS.TEXT_ON_SNACK_BAR]: 'חובה לבחור מספר קורס וגם את אמצעי ההתחברות',
                                [DEFINITIONS.TITLE_ON_SNACK_BAR]: 'שים לב !',
                                [DEFINITIONS.SNACK_BAR_TYPE]: TYPE_OF_SNACK_BAR.WARNING,

                            }
                        })
                    }
                }}
                textStyle={{textAlign: 'center', color: 'white'}}
                text={"התחבר"}
                style={[style.button, style.sendButton]}
            />

        </View>


    </View>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        width: WIDTH_OF_SCREEN / 1.2,

    },
    sendButton: {
        backgroundColor: APP_COLOR.main,

    },
    socialLogin: {
        height: HEIGHT_OF_SCREEN / 15,
        flex: 1,
        borderRadius: WIDTH_OF_SCREEN / 15,
        justifyContent: 'center',
        paddingHorizontal: '5%',
        backgroundColor: 'white',

        ...elevationShadowStyle(3)
    },
    logo: {
        margin:'15%',
        flex: 1
    },
    input: {
        height: HEIGHT_OF_SCREEN / 15,
        width: WIDTH_OF_SCREEN / 1.2,
        borderRadius: WIDTH_OF_SCREEN / 15,

        paddingHorizontal: '5%',
        marginTop: '5%',
        backgroundColor: 'white',
        ...elevationShadowStyle(3)
    },
    button: {
        height: HEIGHT_OF_SCREEN / 15,
        width: WIDTH_OF_SCREEN / 1.2,
        borderRadius: WIDTH_OF_SCREEN / 15,
        justifyContent: 'center',
        paddingHorizontal: '5%',
        marginTop: '5%',
        backgroundColor: 'white',
        ...elevationShadowStyle(3)
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
