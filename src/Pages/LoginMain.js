import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Platform, Alert ,BackHandler, ToastAndroid} from 'react-native';
import Constants, { getCurUserIx } from '../Utils/Constant';
import * as GoogleSignIn from 'expo-google-sign-in';
import { NavigationContext,StackActions} from '@react-navigation/native'
import RestAPI from '../Utils/RestAPI';
import KakaoLogin from './KakaoLogin';
import NaverSignUp from './NaverSignUp';
import AppleSign from './AppleSign';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import messaging from '@react-native-firebase/messaging';

export default class LoginMain extends Component {
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
        if (this.state.user) {
            this.signOutAsync();
        } else {
            this.signInAsync();
        }
    };


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
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Image
                        source={require('../../assets/b_logo.png')}
                        style={{ width: 200,height:30 }}
                    />
                </View>
                <View style={styles.bottomView}>
                    {
                        global.deviceType == '1' ?
                        <View style={{justifyContent: 'center',alignItems:'center',paddingTop:30}}>
                            <Text style={styles.logintitle}>로그인</Text>    
                        </View>
                        :
                        null
                    }
                    <View style={{ justifyContent: 'center' , marginTop: 30}}>
                        <View style={global.deviceType == '1' ? styles.login : styles.loginTablet}>
                        {
                        global.deviceType == '1' ?
                        null :
                        <View style={{justifyContent: 'center',alignItems:'center',marginBottom:80}}>
                            <Text style={styles.logintitle}>로그인</Text>    
                        </View>
                    }
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('emailLogin')
                                }}
                                style={global.deviceType == '1' ? styles.bottomBannerView : styles.bottomBannerViewTablet}
                            >
                                <Image source={require('../../assets/icons/new/email.png')} style={{
                                    resizeMode: 'contain',
                                    width: 25,
                                    height: 35
                                }} />
                                <Text style={styles.btn}>이메일로 로그인</Text>
                            </TouchableOpacity>
                            {/* <NaverSignUp navigation={navigation} /> */}
                                <KakaoLogin navigation={navigation} />
                            {
                                Platform.OS == 'android' ?
                                    <TouchableOpacity
                                        onPress={this.onPress}
                                        style={global.deviceType == '1' ? styles.bottomBannerView : styles.bottomBannerViewTablet}
                                    >
                                        <Image source={require('../../assets/icons/new/google.png')} style={{
                                            resizeMode: 'contain',
                                            width: 25,
                                            height: 35
                                        }} />
                                        <Text style={styles.btn}>Google로 로그인</Text>
                                    </TouchableOpacity> :
                                    <AppleSign type={'login'} navigation={navigation}/>

                            }
                        </View>
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    logintitle: {
        fontSize: 18,
        paddingBottom: 10
    },
    title: { color: '#444', fontSize: 20, fontWeight: 'bold' },
    topView: {
        height: Constants.WINDOW_HEIGHT * 0.4,
        width: Constants.WINDOW_WIDTH,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    login:{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent:'center',
        justifyContent:'center'
    },
    loginTablet:{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent:'center',
        justifyContent:'center',
        height: Constants.WINDOW_HEIGHT/3
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        height: Constants.WINDOW_HEIGHT * 0.55,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    bottomBannerView: {
        flexDirection: 'row',
        width: Constants.WINDOW_WIDTH * 0.65,
        height: 44,
        paddingLeft: Constants.WINDOW_WIDTH * 0.05,
        alignItems: 'center',
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#EEE',
        
    },
    bottomBannerViewTablet:{
        flexDirection: 'row',
        width: Constants.WINDOW_WIDTH * 0.65,
        height: 44,
        paddingLeft: Constants.WINDOW_WIDTH * 0.05,
        alignItems: 'center',
        paddingVertical: 5,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#EEE',
    },
    btn: {
        paddingLeft: 20,
        color: Constants.darkColor,
        fontSize: 16,
    },
    bottomLinkView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    bottomTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft:16
    },
})