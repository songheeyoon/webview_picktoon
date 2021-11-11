// 카카오 회원가입 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login';

    //카카오 회원가입
export default function KakaoSignUp({ navigation ,agree}) {

    const push = agree; 
 
    const Join = () => {

        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
          .then(result => {
              getProfile(result)
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
            console.log(result,"프로필결과");
              kakaoSignUp(
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
      

    const kakaoSignUp = (email, name, gender, age_range, id, profile_image_url, access_token, refresh_token) => {

       if(push==true){
        RestAPI.socialRegister('kakao', email, name, gender, age_range, id, profile_image_url, access_token, refresh_token,1,1,1).then(res => {
            Alert.alert('알림', res.msg, [
                {
                    text: '확인',
                    onPress: () => {
                        navigation.navigate('login')
                    }
                }
            ])
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
       }else{
        RestAPI.socialRegister('kakao', email, name, gender, age_range, id, profile_image_url, access_token, refresh_token,0,0,0).then(res => {
            Alert.alert('알림', res.msg, [
                {
                    text: '확인',
                    onPress: () => {
                        navigation.navigate('login')
                    }
                }
            ])
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
       }

    }




    return (
        <TouchableOpacity
            onPress={Join}
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
            }}>카카오톡으로 가입</Text>
        </TouchableOpacity>
    )

}