// 카카오 로그인 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants, {getCurUserIx} from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login';
import { StackActions } from '@react-navigation/native';

 //카카오 로그인
export default function KakaoLogin({ navigation }) {

    const Login = () => {
        // kakaoLogout();
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
          .then(result => {
              getProfile(result);
          })
          .catch(err => {
            if (err.code === 'E_CANCELLED_OPERATION') {
                console.log(`Login Cancelled:${err.message}`);
            } else {
                console.log(`Login Failed:${err.code} ${err.message}` );
            }
          });
      };
      
      const getProfile = (data) => {
    
        KakaoLogins.getProfile()
          .then(result => {
              kakaoLogin(
                result.email,
                result.nickname,
                result.gender,
                result.age_range,
                result.id,
                result.profile_image_url,
                data.accessToken,
                data.refreshToken
            )
          })
          .catch(err => {
            console.log(`Get Profile Failed:${err.code} ${err.message}`);
          });
      };
    
    // 카카오 로그인
    const kakaoLogin = (email, name, gender, age_range, id, profile_image_url, access_token, refresh_token) => {
        showPageLoader(true)
        RestAPI.socialLogin('kakao', email, name, gender, age_range, id, profile_image_url, access_token, refresh_token).then(async (res) => {

            console.log("this is the return value from the server: ", res)

            if (res.msg == 'suc') {
                global.curUser = res
                await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                navigation.dispatch(
                    StackActions.replace('draw', {
                        userIx: getCurUserIx(),
                    })
                  );
            } else {
                Alert.alert('로그인 오류', '이메일로 회원가입을 진행하였는지 확인해 주세요. 이메일로 회원가입을 하지 않았다면 회원가입후 진행해주세요!', [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.navigate('signupAgree')
                        }
                    }
                ])
                return
            }
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <TouchableOpacity
            onPress={Login}
            style={{
                flexDirection: 'row',
                width: Constants.WINDOW_WIDTH * 0.65,
                height: 44,
                paddingLeft: Constants.WINDOW_WIDTH * 0.05,
                alignItems: 'center',
                paddingVertical: 5,
                marginVertical: 5,
                borderRadius: 5,
                backgroundColor: '#EEE'
            }}
        >
            <Image source={require('../../assets/icons/new/kakao.png')} style={{
                resizeMode: 'contain',
                width: 25,
                height: 35,
            }} />
            <Text style={{
                paddingLeft: 20,
                color: Constants.darkColor,
                fontSize: 16,
                color: 'black'
            }}>카카오톡 로그인</Text>
        </TouchableOpacity>        
    )

}