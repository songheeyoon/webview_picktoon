import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Notifications } from 'expo';

import PageLoaderIndicator from './src/Pages/PageLoaderIndicator';
import PageLoaderIndicatorForStar from './src/Pages/PageLoaderIndicatorForStar';
import AppContainer from './src/AppContainer';
import {Alert, AppRegistry, StatusBar, Platform,Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import { getCurUserIx } from './src/Utils/Constant';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()
  .then((result) => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error

export default function App() {

  const [isShowPageLoader, setIsShowPageLoader] = useState(false)
  const [isShowPageLoaderStar, setIsShowPageLoaderStar] = useState(false)
  const [user,setUser] = useState('');

  global.showPageLoader = (isShow) => {
    setIsShowPageLoader(isShow)
  }

  global.showPageLoaderForStar = (isShow) => {
    setIsShowPageLoaderStar(isShow)
  }

  const _getUUID = async () => {
    let UUID = null
    if (Platform.OS == 'android') {
        UUID = Application.androidId
    } else if (Platform.OS == 'ios') {
        UUID = await Application.getIosIdForVendorAsync()
    }

    return UUID
}
  const _checkPermission = async () => {
    let UUID = await _getUUID()
    global.UUID = UUID
    return true
}

const _getDeviceType = async () => {
  let ipAddress = await Network.getIpAddressAsync();
  let type = await Device.getDeviceTypeAsync();
  let device = Device.modelName;
  console.log("this is Ip address : ", ipAddress)
  console.log("this is device type : ", type)
  // console.log(global.deviceType+"글로벌")
  // for(var key in global){
  //     console.log("key:"+key + ",value:"+global[key]);
  // }
  global.deviceType = type
  global.deviceName = device
  global.ipAddress = ipAddress
}

const getToken = async () => {
  const token = await messaging().getToken();
  global.expoPushToken = token;
}

  const _bootstrapAsync = async () => {
    let res = await _checkPermission()
    // console.error("app.js1");
    if (res == false) {
      return
  }
}
 const getMyObject = async () => {

  await AsyncStorage.getItem('cur_user').then(value=>{
    // console.error(getCurUserIx(),"app.js4");
    global.curUser = JSON.parse(value)
    setUser(global.curUser.user_ix);
    // console.error(getCurUserIx(),"app.js5");
  }).catch(err =>{
      console.log('Err while get async data', err)
  });
  setTimeout(async () => {
    await SplashScreen.hideAsync();
  }, 2000); 
}

useEffect(()=>{
    _getDeviceType();
    getMyObject();
    _bootstrapAsync();
   if( Platform.OS == 'android'){
    getToken();
   }
    console.disableYellowBox = true;

},[])

  return (
    <SafeAreaProvider>
      <AppContainer page={getCurUserIx()}/>
      <PageLoaderIndicator isPageLoader={isShowPageLoader} />
      <PageLoaderIndicatorForStar isPageLoader={isShowPageLoaderStar} />
    </SafeAreaProvider>
  );
}

