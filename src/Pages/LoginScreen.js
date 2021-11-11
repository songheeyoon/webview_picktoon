import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, 
         KeyboardAvoidingView, Platform, Alert, Keyboard, BackHandler, ToastAndroid } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { NavigationContext, StackActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';  

import Constants, { getCurUserIx } from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';
import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';
import AppleSign from './AppleSign';
import  CookieManager  from  '@react-native-cookies/cookies' ;
import messaging from '@react-native-firebase/messaging';

// 사용안함
export default class LoginScreen extends Component {
    static contextType = NavigationContext;

    state = {
        id: '',
        password: '',
        user: null,
    }

    componentDidMount() {
        this.initAsync();
    }
    // 구글 로그인
    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: '444249620673-pea0ut2bbtthaqq32tdef3nqn3uugb6f.apps.googleusercontent.com',
        });
        this._syncUserWithStateAsync();
    };
    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        this.setState({ user });
    };

    // 구글 로그아웃
    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null });
    };

    // 로그인 진행
    signInAsync = async () => {
        const navigation = this.context
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const {type, user} = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                RestAPI.googleAppleLogin('google', user.email, user.firstName, user.lastName, user.photoURL).then(async (res) => {
                    if (res.msg == 'suc') {
                        global.curUser = res
                        await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                        navigation.dispatch(
                            StackActions.replace('draw', {
                                userIx: getCurUserIx(),
                            })
                          );
                        // navigation.navigate('draw',{userIx: getCurUserIx()})
                    } else {
                        Alert.alert('로그인 오류', '구글로 가입한 아이디가 없습니다. 회원가입해 주세요', [{ text: '확인' }])
                        return
                    }
                }).catch(err => {
                    Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                    return
                }).finally(() => {})

            }
        } catch ({ message }) {
            // alert('login: Error:' + message);
            Alert.alert('오류', '오류가 발생하였습니다. 로그인정보를 다시 확인해주세요.', [{ text: '확인'}])
        }
    };

    onPress = () => {

        console.log(this.state.user,"user");
        if (this.state.user) {
            this.signOutAsync();
        } else {
            this.signInAsync();
        }
    };


    // 이메일로 로그인
    Login = () => {
        const navigation = this.context
        if (this.state.id == "") {
            Alert.alert('오류', '이메일(아이디)을 입력해주세요!', [{ text: '확인' }])
            return
        } else if (this.state.password == "") {
            Alert.alert('오류', '비밀번호를 입력해주세요!', [{ text: '확인' }])
            return
        }
        showPageLoader(true)
        RestAPI.login(this.state.id, this.state.password).then(async (res) => {
            if (res.msg == 'suc') {
                global.curUser = res
                await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                navigation.dispatch(
                    StackActions.replace('draw', {
                        userIx: getCurUserIx(),
                    })
                  );

            } else {
                Alert.alert('로그인 오류', '이메일(아이디)과 비밀번호가 정확하지 않습니다!', [{ text: '확인' }])
                return
            }
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }
    // 이벤트 동작
    handleBackButton = () => {
        // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (this.exitApp == undefined || !this.exitApp) {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.exitApp = true;

            this.timeout = setTimeout(
                () => {
                    this.exitApp = false;
                },
                2000    // 2초
            );
        } else {
            clearTimeout(this.timeout);

            BackHandler.exitApp();  // 앱 종료
        }
        return true;
    }
     getMyObject = async () => {
        const navigation = this.context
        await AsyncStorage.getItem('cur_user').then(value=>{
            if(value != null){
                //  background에서 열었을때.
                messaging().onNotificationOpenedApp(remoteMessage => {
                    // PushNotificationIOS.setApplicationIconBadgeNumber(null);
                if(remoteMessage.data.url){
                    navigation.navigate('draw',{url:remoteMessage.data.url});
                }
                return;
                });

                // 최소화 상태에서 눌렀을때
                messaging()
                .getInitialNotification()
                .then(remoteMessage => {
                    if (remoteMessage) {
                        // PushNotificationIOS.setApplicationIconBadgeNumber(null);
                    if(remoteMessage.data.url){
                        navigation.navigate('draw',{url:remoteMessage.data.url});
                    }
                    return;
                    }
                });
                navigation.navigate('draw');
            }
        }).catch(err =>{
            console.log('Err while get async data', err)
        });
      }

      componentDidMount() {
          this.getMyObject();
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
      }
    
      componentWillUnmount() {
        this.exitApp = false;
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
      }

    render() {
        const navigation = this.context
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                enabled >
                <View style={styles.container}>
                    <View style={styles.topView}>
                        <Image
                            source={require('../../assets/b_logo.png')}
                            style={{ width: 200,height:30 }}
                        />
                    </View>
                    <View style={styles.bottomView}>

                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                                 <Text style={styles.title}>로그인</Text>
                                <TextInput
                                    style={styles.inputFieldView}
                                    onChangeText={id => this.setState({ id })}
                                    value={this.state.id}
                                    placeholder={'ID'}
                                />
                                <TextInput
                                    style={styles.inputFieldView}
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    placeholder={'PW'}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        this.Login()
                                    }}
                                    style={styles.bottomBannerView}
                                >
                                    <Text style={styles.loginBtn}>로그인</Text>
                                </TouchableOpacity>
                                <View style={styles.hr}>
                                    <View style={{flex: 1, height: 1, backgroundColor: '#D3D3D3',marginRight:19}} />
                                    <View>
                                        <Text style={{textAlign: 'center',color:'#D3D3D3'}}> 간편 로그인 </Text>
                                    </View>
                                    <View style={{flex: 1, height: 1, backgroundColor: '#D3D3D3',marginLeft:19}} />
                                </View>
                                <View style={styles.socialBtns}>
                                    <View style={{ ...styles.socialBtn }}>
                                        <KakaoLogin navigation={navigation} />
                                    </View>
                                    {/* <View style={{ ...styles.socialBtn, backgroundColor: '#01c73c' }}>
                                        <NaverLogin navigation={navigation} />
                                    </View> */}
                                    {
                                        Platform.OS == 'android' ?
                                            <View style={[{ ...styles.socialBtn },{marginLeft:39}]}>
                                                <TouchableOpacity
                                                    onPress={this.onPress}
                                                    style={{flexDirection : 'row'}}
                                                >
                                                <Image source={require('../../assets/icons/new/google.png')} style={{
                                                    resizeMode: 'contain',
                                                    width: 26,
                                                    height:26,
                                                    marginRight:6
                                                }} />
                                                 <Text style={{alignSelf:"center"}}>구글</Text>
                                                </TouchableOpacity>
                                            </View> :
                                            <AppleSign type={'login'} navigation={navigation} />
                                    }

                                </View>
                                <View style={styles.bottomLinkView}>
                                    <Text>픽툰이 처음이신가요? </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({id: ''})
                                            this.setState({password: ''})
                                            navigation.navigate('signupAgree')
                                        }}>
                                        <Text style={styles.bottomTitle}>회원가입</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    topView: {
        height: Constants.WINDOW_HEIGHT * 0.4,
        width: Constants.WINDOW_WIDTH,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        height: Constants.WINDOW_HEIGHT * 0.6,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    inputFieldView: {
        paddingLeft: 10,
        borderColor: '#DDD',
        borderWidth: 1,
        width: Constants.WINDOW_WIDTH * 0.8,
        marginTop: 15,
        borderRadius: 5,
        fontSize: 16,
        height:44
    },
    bottomBannerView: {
        backgroundColor: '#A1C98A',
        width: Constants.WINDOW_WIDTH * 0.8,
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 15,
        marginBottom: 30,
        borderRadius: 5
    },
    hr:{
        width: Constants.WINDOW_WIDTH * 0.8,
        flexDirection: 'row', 
        alignItems: 'center'
    },
    loginBtn: {
        color: 'white',
        fontSize: 18,
    },
    title: {
        fontSize: 18,
        paddingBottom: 10
    },
    socialBtns: {
        flexDirection: 'row',
        marginTop:28,
        width: Constants.WINDOW_WIDTH * 0.8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialBtn: {
        // height: 44, width: 44, padding: 5,
        // borderRadius: 22,
        // marginHorizontal: 10,

    },
    bottomLinkView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    bottomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft:16
    },
})