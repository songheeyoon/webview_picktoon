import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, 
         KeyboardAvoidingView, Platform, Alert, Keyboard, BackHandler, ToastAndroid } from 'react-native';
import { NavigationContext, StackActions } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';  

import Constants, { getCurUserIx } from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

// email 로 로그인 
export default class EmailLogin extends Component {
    static contextType = NavigationContext;

    state = {
        id: '',
        password: '',
        user: null,
    }

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
                    {
                        global.deviceType == '1' ?
                        <View style={{justifyContent: 'center',alignItems:'center',paddingTop:30}}>
                            <Text style={styles.logintitle}>로그인</Text>    
                        </View>
                        :
                        null
                    }
                        <View style={{  justifyContent: 'center' , marginTop: 30}}>
                            <View style={global.deviceType == '1' ? styles.loginBox : styles.loginBoxTablet}>
                            {
                                global.deviceType == '1' ?
                                null :
                                <View style={{justifyContent: 'center',alignItems:'center',marginBottom:80}}>
                                    <Text style={styles.logintitle}>로그인</Text>    
                                </View>
                            }
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
    login:{
        justifyContent: 'center',alignItems:'center',paddingTop:30
    },
    loginTablet:{
        justifyContent: 'center',alignItems:'center',paddingTop:80
    },
    loginBox:{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent:'center',
        justifyContent:'center'
    },
    loginBoxTablet:{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent:'center',
        justifyContent:'center',
        height: Constants.WINDOW_HEIGHT/3
    },
    logintitle: {
        fontSize: 18,
        paddingBottom: 10
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
        height: Constants.WINDOW_HEIGHT * 0.55,
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
        borderRadius: 5,
        fontSize: 16,
        height:44,
        marginTop: 15
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
        width:'33%'
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