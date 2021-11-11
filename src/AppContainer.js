import 'react-native-gesture-handler';

import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useLinking, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawNavigation from './DrawNav/DrawNavigation';
import LoginMain from './Pages/LoginMain';
import LoginScreen from './Pages/LoginScreen';
import SignupScreen from './Pages/SignupScreen';
import SignupInputScreen from './Pages/SignupInputScreen';
import SignupAgreeScreen from './Pages/SignupAgreeScreen';
import EmailLogin from './Pages/EmailLogin';

// import { Notifications } from 'expo';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import { Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import HomeView from './DrawNav/Home/HomeView';
import BannerLinkView from './DrawNav/Home/BannerLinkView';
import { getCurUserIx } from './Utils/Constant';
import { AppleAuthenticationUserDetectionStatus } from 'expo-apple-authentication';

import analytics from '@react-native-firebase/analytics';

const Stack = createStackNavigator()


export default function AppContainer(props) {
  const ref = useRef();
  const routeNameRef = useRef();
  const [user,setUser] = useState('');

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();



    const {getInitialState} = useLinking(ref,{
        prefixes: ['https://picktoon.com/app_home','picktoon://'],
        config:{
          screen:{
            draw:{
              path:'draw',
              screen:{
                home : {
                    path:'home'
                }
            }
          },
            login:'login',
            signup:'signup',
            signupAgree:'signupagree',
            signupInput:'signupinput',
            webview : 'webview',
            emailLogin : 'emailLogin'
            }
          }      
     });

      useEffect(() => {
        getInitialState()
          .catch(() => {})
          .then(state => {
            if (state !== undefined) {
              setInitialState(state);
            }
            setIsReady(true);
          });
      }, [getInitialState]);
  
    if (!isReady) {
      return null;
    }


  return (
      <NavigationContainer initialState={initialState} ref={ref}
        onReady={() => {
          routeNameRef.current = ref.current.getCurrentRoute().name
        }}
        onStateChange={async(state) => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = ref.current.getCurrentRoute().name

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName
            });
          }
        }}>
      <Stack.Navigator initialRouteName={props.page != '' ? "draw" : "login"} headerMode="none">

        <Stack.Screen name='login' component={LoginMain} />
        <Stack.Screen name='draw' component={DrawNavigation} options={{gestureEnabled: false}} initialParams={{url:''}}/>
        
        {/* <Stack.Screen name='login' component={LoginScreen} /> */}
  
        {/* 로그인 스크린 */}
        {/* <Stack.Screen name='login' component={LoginScreen} /> */}
        {/* <Stack.Screen name='home' component={HomeView} /> */}
        {/* 회원가입 관련 스크린 */}
        <Stack.Screen name='signup' component={SignupScreen} />
        <Stack.Screen name='signupAgree' component={SignupAgreeScreen} />
        <Stack.Screen name='signupInput' component={SignupInputScreen} />
        <Stack.Screen name='emailLogin' component={EmailLogin} />

        <Stack.Screen name='webview' component={BannerLinkView} />
        {/* <Stack.Screen name='draw' component={DrawNavigation} options={{gestureEnabled: false}} /> */}

        {/* 메인 드로우 내비게이션 스크린 */}
        {/* <Stack.Screen name='draw' component={DrawNavigation} options={{gestureEnabled: false}} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

