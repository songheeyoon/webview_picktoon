import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Alert, BackHandler, RefreshControl, Image, Linking, AppState, TouchableOpacity,Share,StatusBar, KeyboardAvoidingView, ToastAndroid, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import { Header } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import { UIActivityIndicator, MaterialIndicator } from "react-native-indicators";

import Constants, { topPadding, getCurUserIx, isIOS, isIPhoneX, StatusBarHeight } from '../../Utils/Constant';

import RestAPI from '../../Utils/RestAPI';


import { WebView } from 'react-native-webview';

// import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';

import ActionSheet from '../Components/ActionSheet'

import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

import ImagePicker from 'react-native-image-crop-picker';

import KakaoLogin from '../../Pages/KakaoLogin';
import { handleBackButton } from '../../Utils/BackHandler';
import { useFocusEffect, StackActions,} from '@react-navigation/native';
import KakaoLogins from '@react-native-seoul/kakao-login';
import * as GoogleSignIn from 'expo-google-sign-in';

import  CookieManager  from  '@react-native-cookies/cookies' ;
import messaging from '@react-native-firebase/messaging';
import axios from 'react-native-axios/lib/axios';
import PushNotification from 'react-native-push-notification';

import YoutubePlayer from "react-native-youtube-iframe";

import * as ScreenOrientation from 'expo-screen-orientation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

// 홈 페이지
export default function HomeView({ navigation, route }) {
    let backhandler = null
    let toastRef = useRef()
    let scrollRef = useRef(null)
    let viewRef = useRef()

    let curUserIx = ''
    const [load,setLoad] = useState(true)
    const [load2,setLoad2] = useState(true)
    const [draw,setDraw] = useState(false)
    const [mode,setMode] = useState(false)
    const [comment,setComment] = useState('');
    const [img,setImg] = useState('');
    const [homeData, getHomeData] = useState()
    const [appState, setAppstate] = useState(AppState.currentState);

    const [bg,setBg] = useState(false);
    const [webix,setWebix] = useState('')
    const [url,setUrl] = useState('');
    const [shareurl,setShareurl] = useState('');

    const [canGoBack, SetCanGoBack] = useState(false);
    const [exitApp, setExitApp] = useState(0);

    const closeActionSheet = () => setActionSheet(false);
    const [actionSheet,setActionSheet] = useState(false);

    const closeActionSheet2 = () => setActionSheet2(false);
    const [actionSheet2,setActionSheet2] = useState(false);

    const closeActionSheet3 = () => setActionSheet3(false);
    const [actionSheet3,setActionSheet3] = useState(false);

    const closeActionSheet4 = () => setActionSheet4(false);
    const [actionSheet4,setActionSheet4] = useState(false);

    const closeActionSheet5 = () => setActionSheet5(false);
    const [actionSheet5,setActionSheet5] = useState(false);

    const closeActionSheet6 = () => setActionSheet6(false);
    const [actionSheet6,setActionSheet6] = useState(false);

    const closeGallery = () => setActionGallery(false);
    const [actionGallery,setActionGallery] = useState(false);

    const closeVideo = () => setVideo(false);
    const [video,setVideo] = useState(false);

    const [response, setResponse] = useState(null);
    const [img_ix , setImg_ix] = useState();
    const [images , setImages] = useState();
    const [id_name,setId_name] = useState();
    
        useEffect(()=>{
            if(route.params.url!=''){
                setUrl(route.params.url)
            }
        },[route.params.url])

    useEffect(() => {
        //  background에서 열었을때.
        messaging().onNotificationOpenedApp(remoteMessage => {
            // PushNotificationIOS.setApplicationIconBadgeNumber(null);
          if(remoteMessage.data.url){
                setUrl(remoteMessage.data.url);
          }
        });

        // 최소화 상태에서 눌렀을때
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
                // PushNotificationIOS.setApplicationIconBadgeNumber(null);
              if(remoteMessage.data.url){
                setUrl(remoteMessage.data.url);
            }
            }
          });
      }, []);

      useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // PushNotificationIOS.setApplicationIconBadgeNumber(null);
            console.log("알림이 왔따");
        PushNotification.localNotification({
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            showWhen : true,
            when: new Date().getTime()
        });

        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: notification => {
                console.log(notification,"notification");
                if(notification.userInteraction == true){
                    setUrl(remoteMessage.data.url);
                }
            },
            popInitialNotification: true,
            requestPermissions: true
          });

        });

        return unsubscribe;
        }, []);

    // 기기의 uuid얻기
    const _getUUID = async () => {
        let UUID = null
        if (Platform.OS == 'android') {
            UUID = Application.androidId
        } else if (Platform.OS == 'ios') {
            UUID = await Application.getIosIdForVendorAsync()
        }

        return UUID
    }

        // 푸시알림을 위한 기기의 권한얻기 및 설정
        const _getPushTokenAsync = async () => {

            const authorizationStatus = await messaging().requestPermission();
            if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                const token = await messaging().getToken();
                global.expoPushToken = token;
                RegisterToken();
                return true;
              } else {
                    Alert.alert(
                        '오류',
                        '픽툰알림 허용을 하지 않고서는 픽툰 혜택 및 광고성알림을 받을수 없습니다. 지금 설정하시겠습니까?',
                        [
                            {
                                text: '취소',
                                onPress: () => {
                                    
                                }
                            }
                            , {
                                text: '앱설정 바로가기',
                                onPress: () => {
                                    if (Platform.OS === 'ios') {
                                        Linking.openURL('app-settings://notification');
                                    } else {
                                        Linking.openSettings();
                                    }
                                }
                            }
                        ]
                    )
                return false;
              }
        }

    const logout = () => {
        RestAPI.logout(getCurUserIx()).then(res => {
            kakaoLogout();
        }).catch(err => {
            Alert.alert('로딩 오류', err.message, [{ text: '확인' }])
        }).finally(() => { })
    }

    const kakaoLogout = () => {
 
        KakaoLogins.logout()
          .then(result => {

          })
          .catch(err => {

          });
      };
    const log_out = async () => {
        logout()
        GoogleSignIn.signOutAsync();
        global.curUser = null
        global.apprCount = null
        await AsyncStorage.removeItem('cur_user')

        CookieManager.clearAll();

        navigation.dispatch(StackActions.replace('login'));
    }

    function camera () {
        ImagePicker.openCamera({
            width: 400,
            height: 250,
            includeBase64:true,
            cropping: true,
          }).then(image => {
            if(bg==true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'bg'
                }
                webviewRef.postMessage(JSON.stringify(data));
            }else if(mode == true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'gallery'
                }
                webviewRef.postMessage(JSON.stringify(data));              
            }else{
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'profile'
                }
                webviewRef.postMessage(JSON.stringify(data));                
            }
          });
    }
    function profile_camera () {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            includeBase64:true,
            cropping: true,
          }).then(image => {
            if(bg==true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'bg'
                }
                webviewRef.postMessage(JSON.stringify(data));
            }else if(mode == true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'gallery'
                }
                webviewRef.postMessage(JSON.stringify(data));              
            }else{
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'profile'
                }
                webviewRef.postMessage(JSON.stringify(data));                
            }
          });
    }
    function album (){
        ImagePicker.openPicker({
            width: 400,
            height: 250,
            includeBase64:true,
            cropping: true
          }).then(image => {
            if(bg==true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'bg'
                }
                // console.log(data);
                webviewRef.postMessage(JSON.stringify(data));
            }else if(mode == true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'gallery'
                }
                webviewRef.postMessage(JSON.stringify(data));              
            }
            else{
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : ''
                }
                // console.log(data);
                webviewRef.postMessage(JSON.stringify(data));                
            }
            
          });
    }
    function profile_album (){
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            includeBase64:true,
            cropping: true
          }).then(image => {
            if(bg==true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'bg'
                }
                // console.log(data);
                webviewRef.postMessage(JSON.stringify(data));
            }else if(mode == true){
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : 'gallery'
                }
                webviewRef.postMessage(JSON.stringify(data));              
            }
            else{
                const data = {
                    "src" : `data:${image.mime};base64,` + image.data,
                    "mode" : ''
                }
                // console.log(data);
                webviewRef.postMessage(JSON.stringify(data));                
            }
            
          });

    }
    const ActionButtons = ['부적절한 한줄평 신고하기', '스포일러 신고하기', '취소'];
    const CANCEL_INDEX = 2;
    // 댓글 신고
    const actionItems = [
        {
            id : 1,
            label : '부적절한 한줄평 신고하기',
            onPress : () => {
                if(comment == 'comment'){
                    ReportComment(webix,'comment','inapposite');
                }else if(comment == "recomment"){
                    ReportComment(webix,'recomment','inapposite'); 
                }else{
                    ReportComment(webix,'bookcasecomment','inapposite'); 
                }
                closeActionSheet();
            }
        },
        {
            id : 2,
            label : '스포일러 신고하기',
            onPress : () => {
                if(comment == true){
                    ReportComment(webix,'comment','spoiler');
                }else if(comment == "recomment"){
                    ReportComment(webix,'recomment','spoiler'); 
                }else{
                    ReportComment(webix,'bookcasecomment','spoiler'); 
                }
                closeActionSheet();
            }
        }
    ]
    // 즐겨찾기
    const actionItems2 = [
        {
            id : 1,
            label : '웹툰 상세 프로필 보기',
            onPress : () => {
                setUrl("https://picktoon.com/app_profile?webix="+webix+'&d='+Date.now());
                closeActionSheet2();
            }
        },
        {
            id : 2,
            label : '즐겨찾기 삭제하기',
            onPress : () => {
                Alert.alert(
                    "경고",
                    "정말 삭제하시겠어요?",
                    [
                      {
                        text: "취소",
                        style: "cancel"
                      },
                      { text: "네,할게요", onPress: () =>  webviewRef.postMessage(webix) }
                    ],
                    { cancelable: false }
                  );
                  closeActionSheet2();
            }
        }
    ]
    // 제보사진
    const actionItems3 = [
        {
            id : 1,
            label : '직접 찍기',
            onPress : () => {
                profile_camera();         
                setTimeout(() => {
                    closeActionSheet3();
                  }, 500); 
            }
        },
        {
            id : 2,
            label : '앨범에서 선택',
            onPress : () => {
                profile_album();
                setTimeout(() => {
                    closeActionSheet3();
                  }, 500); 
            }
        }
    ]
    // 프로필
    const actionItems4 = [
        {
            id : 1,
            label : '직접 찍기',
            onPress : () => {
                if(bg){
                    camera();
                    setTimeout(() => {
                        closeActionSheet4();
                      }, 500); 
                }else{
                    profile_camera()
                    setTimeout(() => {
                        closeActionSheet4();
                      }, 500); 
                }

            }
        },
        {
            id : 2,
            label : '앨범에서 선택',
            onPress : () => {
                if(bg){
                    album();
                    setTimeout(() => {
                        closeActionSheet4();
                      }, 500); 
                }else{
                    profile_album();
                    setTimeout(() => {
                        closeActionSheet4();
                      }, 500); 
                }
            }
        },
        {
            id : 3,
            label : '기본 사진으로',
            onPress : () => {
                closeActionSheet4();
                if(bg==true){
                    const data = {
                        'type' : 'base',
                        "mode" : 'bg'
                    }
                    webviewRef.postMessage(JSON.stringify(data));
                }else{
                    const data = {
                        'type' : 'base',
                        "mode" : 'profile'
                    }
                    webviewRef.postMessage(JSON.stringify(data));                   
                }
            }
        }
    ]
    // 책장
    const actionItems5 = [
        {
            id : 1,
            label : '수정',
            onPress : () => {
                // setUrl("https://picktoon.com/app_bookcase_create?type=edit&case_ix="+webix+'&d='+Date.now());
                const data = {
                    "mode" : 'modified'
                }
                webviewRef.postMessage(JSON.stringify(data));
                closeActionSheet5();
            }
        },
        {
            id : 2,
            label : '삭제',
            onPress : () => {
                Alert.alert(
                    "경고",
                    "정말 삭제하시겠어요?, 삭제된 책장은 복구할 수 없어요",
                    [
                      {
                        text: "취소",
                        style: "cancel"
                      },
                      { text: "네,할게요", onPress: () =>  book_delete(webix) }
                    ],
                    { cancelable: false }
                  );
                  closeActionSheet5();
            }
        },
        {
            id : 3,
            label : '공유',
            onPress : () => {
                closeActionSheet5();
                onShare(shareurl);
            }
        }
    ]
    // 내 댓글 삭제
    const actionItems6 = [
        {
            id : 1,
            label : '삭제',
            onPress : () => {
                Alert.alert(
                    "경고",
                    "정말 삭제하시겠어요?, 삭제된 댓글은 복구할 수 없어요",
                    [
                      {
                        text: "취소",
                        style: "cancel"
                      },
                      { text: "네,할게요", onPress: () =>  {
                        if(comment == 'comment'){
                            comment_delete(webix,'comment_del');
                        }else if(comment == "recomment"){
                            comment_delete(webix,'recomment_del'); 
                        }else{
                            bookcase_comment_delete(webix,'bookcasecomment_del'); 
                        }
                      } }
                    ],
                    { cancelable: false }
                  );
                  closeActionSheet6();
            }
        }
    ]
    const onShare = async (url) => {
        try {
          const result = await   Share.share({
            message: url,
            // url: 'https://picktoon.com/app_profile?webix=11038',
            // title: 'Wow, did you see that?'
          }, {
            // Android only:
            dialogTitle: '공유하기',
            // iOS only:
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter'
            ]
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };
 
    // 기기의 권한 얻기
    const _checkPermission = async () => {
        let UUID = await _getUUID()
        global.UUID = UUID
        // if (Device.isDevice) {
        //     // let token = await _getPushTokenAsync()
        //     // console.log(token)
        //     // global.expoPushToken = token
        // } else {
        //     global.expoPushToken = 'simulator'
        // }
        return true
    }

    
    const _bootstrapAsync = async () => {
        let res = await _checkPermission()
        if (res == false) {
            return
        }
        AsyncStorage.getItem('cur_user', (err, data) => {
            // console.log(err, data)
        }).then(data => {
            global.curUser = JSON.parse(data)

            // navigation.navigate('draw');
        }).catch(err => {
            // console.log('Err while get async data', err)
            // navigation.navigate('draw');
        })

    }

    useEffect(()=>{
        _bootstrapAsync()
        _getPushTokenAsync()
        // createChannel()
        // notificationsListener()
    },[])
    
    useEffect(()=>{
        if(global.curUser == ''){
            navigation.dispatch(StackActions.replace('login'));
        }
    },[global.curUser]);

    const RegisterToken = () => {
        RestAPI.registerToken(getCurUserIx(),isIOS()).then(res => {
            if (res.msg == 'suc') {

            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])                
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => { })        
    }
    //부적절한 한줄평 신고 
    const ReportComment = (commentIx,type,mode) => { 
        RestAPI.postCommen(commentIx,type,mode,getCurUserIx(),isIOS()).then(res => {
            if (res.msg == 'suc') {
                Alert.alert('알림', '신고해 주셔서 감사합니다. 관리자의 검토 후 반영하겠습니다.', [{ text: '확인' }])
                closeActionSheet2();
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => { })
    }
      // 삭제
      const book_delete = (caseIx) => { 
        RestAPI.bookDelete(caseIx,getCurUserIx(),isIOS()).then(res => {
            if (res.msg == '200') {
                Alert.alert('알림', '책장 삭제가 완료되었습니다.', [{ text: '확인' }])
                // setUrl()
                closeActionSheet5();
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => { })
    }  
//댓글삭제
    const comment_delete = (commentIx,mode) => { 
        RestAPI.deleteComment(commentIx,mode,getCurUserIx(),isIOS()).then(res => {
            if (res.msg == '200') {
                Alert.alert('알림', '댓글이 삭제 되었습니다.', [{ text: '확인' }])
                closeActionSheet6();
                const data = {
                    'mode' : 'refresh'
                }
                webviewRef.postMessage(JSON.stringify(data));
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => { })
    }
//책장 댓글삭제
const bookcase_comment_delete = (commentIx,mode) => { 
    RestAPI.deletebookComment(commentIx,mode,getCurUserIx(),isIOS()).then(res => {
        if (res.msg == '200') {
            Alert.alert('알림', '댓글이 삭제 되었습니다.', [{ text: '확인' }])
            closeActionSheet6();
            const data = {
                'mode' : 'refresh'
            }
            webviewRef.postMessage(JSON.stringify(data));
        } else {
            Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => { })
}
//문의 삭제
const inquiry_delete = (inquiryix) => { 
    RestAPI.deleteinquiry(inquiryix,getCurUserIx(),isIOS()).then(res => {
        if (res.msg == '200') {
            Alert.alert('알림', '해당 문의 내역이 삭제 되었습니다.', [{ text: '확인' }])
            const data = {
                'mode' : 'refresh'
            }
            webviewRef.postMessage(JSON.stringify(data));
        } else {
            Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => { })
}
const getGallery = (webix) => {
    RestAPI.getGalleryImg(webix).then(res => {
 
        if (res.msg == '200') {
            setImages(res.url_list);
            setActionGallery(true);
        } 
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => { })
}


//   등장인물 이미지 가져오기
const getCharacter = (webix) => {
    RestAPI.getCharacterImg(webix).then(res => {
        if (res.msg == '200') {
            setImages(res.url_list);
            setActionGallery(true);
        } 
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => { })
}

const alertmessage = (msg) =>{
    Alert.alert('알림',msg, [{ text: '확인' }])
}


    const handleSetRef = _ref => {
        webviewRef = _ref;
      };

      const onBackPress = () => {

        if (webviewRef && canGoBack ) {
            if(actionGallery == true){
                closeGallery();
            }else if(actionSheet == true){
                closeActionSheet();
            }else if(actionSheet2 == true){
                closeActionSheet2();
            }else if(actionSheet3 == true){
                closeActionSheet3();
            }else if(actionSheet4 == true){
                closeActionSheet4();
            }else if(actionSheet5 == true){
                closeActionSheet5();
            }else if(actionSheet6 == true){
                closeActionSheet6();
            }else if(video == true){
                closeVideo();
            }else{
            webviewRef.goBack();
            }
            return true;
        }else{
            if(video == true){
                closeVideo();
                return true;
            }else if(draw == true){
                const data = {
                    "mode" : "draw"
                }
                setDraw(false);
                webviewRef.postMessage(JSON.stringify(data));
                return true;
            }else{
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            console.log("끝");
            setTimeout(() => {
                setExitApp(0);
              }, 2000); // 2 seconds to tap second-time
              ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
              return true;
            }
        }
      };
      
      useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        Keyboard.addListener('keyboardWillShow',onKeyboardShow);
        // cleanup function
        return () => {
          Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
          Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
          Keyboard.removeListener('keyboardWillShow',onKeyboardShow);
        };
      }, []);
    // 키보드가 보일 때.
      const _keyboardDidShow = () => {
        StatusBar.setBarStyle( 'dark-content' );
      };
    
      const _keyboardDidHide = () => {
        StatusBar.setBarStyle( 'dark-content' );
      };

     const onKeyboardShow = () => {
        StatusBar.setBarStyle( 'dark-content' );
    }
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
          BackHandler.removeEventListener("hardwareBackPress",onBackPress);
      }, [canGoBack,video,actionGallery,actionSheet,actionSheet2,actionSheet3,actionSheet4,actionSheet5,actionSheet6,draw]);

      
      // 이 함수를 작동시키지 않으면 stopLoading() 문제로 인해 안드로이드에서 소스페이지의 다른 링크를 탭할 수 없습니다. 그래서 stopLoading를 방지하기 위해 아래 함수를 실행합니다.
        const onShouldStartLoadWithRequest = event => {
           
            if(Platform.OS == 'ios'){
                if (!event.mainDocumentURL.includes("picktoon.com")&&!event.mainDocumentURL.includes("youtube.com")) {
                    Linking.openURL(event.mainDocumentURL);
                    return false;
                }else if(event.mainDocumentURL.includes("picktoon.com/app_home")){
                    SetCanGoBack(false);
                }
                else{
                    StatusBar.setBarStyle('dark-content');
                }                
            }else{
                console.log(url);
                if ((!event.url.includes("picktoon.com"))&&!event.url.includes("youtube.com")) {
                    
                    Linking.openURL(event.url);
                    return false;
                    }
                else if(event.url.includes('picktoon.com/app_home')){
                    SetCanGoBack(false);
                }
            }
            return true;
        };
 
            // 이미 카카오 계정이 로그인 되어 잇다면 탈퇴하기
    async function unlinkKakao() {
        const config = {
            headers: {
                Authorization: 'Bearer ' + global.curUser.access_token
            }
        }
        const res_user = await axios.get('https://kapi.kakao.com/v1/user/unlink', config)
        console.log("kakao unlink : ", res_user)
    }


    // 계정닫기 문의
    const Close = () => {
        Alert.alert('알림', '정말 탈퇴하시겠습니까?', [
            { text: '취소' },
            {
                text: '확인',
                onPress: () => {
                    if(global.curUser.type == 'kakao'){
                        unlinkKakao()
                    }
                    CloseAccount()
                }
            }
        ])
    }

    // 계정닫기 확인
    const CloseAccount = () => {
        showPageLoader(true)
        RestAPI.closeAccount(getCurUserIx() ).then(res => {
            if (res.msg == 'suc') {
                Alert.alert('탈퇴 성공', '탈퇴되었습니다. 그동안 이용해주셔서 감사합니다!', [{
                    text: '확인',
                    onPress: async () => {
                        global.curUser = null
                        global.apprCount = null
                        await AsyncStorage.removeItem('cur_user')
                        CookieManager.clearAll();
                        navigation.dispatch(StackActions.replace('login'));
                    }
                }])
            } else {
                Alert.alert('탈퇴 오류', '관리자에게 문의해주세요.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }
    const jsCode = `alert(document.cookie)`;
    const js =`document.cookie="user_ix=${getCurUserIx()}";`;

    const img_list = (images) => {
        let urls = [];
        images.forEach((img)=>{
            urls.push({
                url : img
            })
        })
        return urls;
    }

    const onFullScreenChange = isFullScreen => {

        ScreenOrientation.lockAsync(
          isFullScreen
            ? ScreenOrientation.OrientationLock.LANDSCAPE
            : ScreenOrientation.OrientationLock.PORTRAIT,
        ).catch(console.log);

        if(isFullScreen == false){
           
            closeVideo();
        }
      };

    return (
        
                   
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white'}} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled={Platform.OS === "android"}>
                <WebView 
                ref={handleSetRef}
                style={{marginTop:StatusBarHeight,marginBottom:isIPhoneX() ? 20 : 0}}
                    source={{ uri:url? url : "https://picktoon.com/app_home?user_ix="+getCurUserIx()}}
                    decelerationRate={500} // 속도 높이려고 추가
                    javaScriptEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                    injectedJavaScript={js}
                    autoManageStatusBarEnabled={false}
                    showsVerticalScrollIndicator={false}
                    onMessage={(event)=>{
                        const data = JSON.parse(event.nativeEvent.data);
                        // const data = event.nativeEvent.data;
                        console.log(data);
                        if(data.type == 'declaration'){
                            setWebix(data.ix);
                            if(data.mode=='comment'){
                                if(data.ix2 == getCurUserIx()){
                                    setActionSheet6(true);
                                }else{
                                    setActionSheet(true);
                                }
                                setComment("comment");
                            }else if(data.mode=='recomment'){
                                if(data.ix2 == getCurUserIx()){
                                    setActionSheet6(true);
                                }else{
                                    setActionSheet(true);
                                }
                                setComment('recomment');
                            }else if(data.mode=='bookcasecomment'){
                                if(data.ix2 == getCurUserIx()){
                                    setActionSheet6(true);
                                }else{
                                    setActionSheet(true);
                                }
                                setComment('bookcasecomment');
                            }
                        }
                        else if(data.type =='share'){
                            onShare(data.url);

                        }else  if(data.type == 'bookmark'){
                            setWebix(data.ix);
                            setActionSheet2(true);
                            
                        }else if(data.type =='favorties'){
                            Alert.alert('알림', '즐겨찾기에 추가 완료되었습니다.', [{ text: '확인' }])                            
                        }else if(data.type =='photo'){
                            if(data.mode=='gallery'){
                                setMode(true);
                            }else{
                                setMode(false);
                            }
                            setActionSheet3(true);
                        }else if(data.type =='photo2'){
                            if(data.mode =='bg'){
                                setBg(true);
                            }else{
                                setBg(false);
                            }
                            setActionSheet4(true);
                        }else if(data.type == 'alert'){
                            alertmessage(data.text);
                        }else if(data.type =='logout'){
                            Alert.alert('알림', '로그아웃 하시겠습니까? ', [
                                { text: '취소' },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        log_out();
                                    }
                                }
                            ])     
                               
                        }else if(data.type =='bookcase'){
                            setWebix(data.ix);
                            setShareurl(data.url);
                            setActionSheet5(true);
                        }else if(data.type == 'search_del'){
                            Alert.alert(
                                "경고",
                                "정말 삭제하시겠어요?",
                                [
                                  { text: "취소" },
                                  { text: "네,할게요", onPress: () =>  {
                                    const data =  'recent_del'
                                    webviewRef.postMessage((data)); 
                                  } }
                                ],
                                { cancelable: false }
                              );
                        }else if(data.type =='inquirt_del'){
                            setWebix(data.ix);
                            Alert.alert('경고', '정말 삭제하시겠어요? ', [
                                { text: '취소' },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        inquiry_delete(data.ix);
                                    }
                                }
                            ])                                 
                        }else if(data.type=='withdrawal'){
                            Close();
                        }else if(data.type=='draw'){
                            setDraw(true)
                        }else if(data.type=='url'){
                            setUrl(data.url);
                        }else if(data.type=='video'){
                            //여기서 ix 는 유튜브 아이디값
                            setId_name(data.ix);
                            setVideo(true);
                        }
                        else if(data.type == 'galleryImg'){
                            setWebix(data.ix);
                            setImg_ix(parseInt(data.ix2));
                            getGallery(data.ix);
                        }else if(data.type == 'characterImg'){
                            setWebix(data.ix);
                            setImg_ix(parseInt(data.ix2));
                            getCharacter(data.ix);                          
                        }
                    }}
                    onLoadStart={()=>{
                        setLoad(true)
                    }}
                    onLoad={()=>{
                        setLoad(false)
                    }}
                    onLoadEnd={() => {
                        [10, 50, 100, 500, 1000].forEach(timeout => {
                          setTimeout(() => {
                            StatusBar.setBarStyle("dark-content");
                          }, timeout);
                        });
                      }}
                    bounces={false}
                    onNavigationStateChange={(navState) => {
                        SetCanGoBack(navState.canGoBack);
                        StatusBar.setBarStyle("dark-content");
                      }}
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    useWebKit={true}
                />
                <StatusBar barStyle={'dark-content'}/>
                {load ?
                    <UIActivityIndicator
                    style={{
                    flex: 1,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex:1000,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center' }}
                    size={25} count={10}
                    />   
                :null}
            {/* {
                getCurUserIx() != '' && homeData && (homeData.favor_count != '1' || homeData.favor_count != 1) ?
                    <HomeModal isVisible={true} navigation={navigation} /> :
                    null
            } */}
 
            <Toast ref={toastRef} />
            <Modal
            isVisible={actionSheet}
            onBackdropPress={ closeActionSheet }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems}
                onCancel={closeActionSheet}
            />
            </Modal>  
            <Modal
            isVisible={actionSheet2}
            onBackdropPress={ closeActionSheet2 }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems2}
                onCancel={closeActionSheet2}
            />
            </Modal>  
            <Modal
            isVisible={actionSheet3}
            onBackdropPress={ closeActionSheet3 }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems3}
                onCancel={closeActionSheet3}
            />
            </Modal> 
            <Modal
            isVisible={actionSheet4}
            onBackdropPress={ closeActionSheet4 }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems4}
                onCancel={closeActionSheet4}
            />
            </Modal>      
            <Modal
            isVisible={actionSheet5}
            onBackdropPress={ closeActionSheet5 }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems5}
                onCancel={closeActionSheet5}
            />
            </Modal>  
            <Modal
            isVisible={actionSheet6}
            onBackdropPress={ closeActionSheet6 }
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            coverScreen={false}
            >
            <ActionSheet
                actionItems={actionItems6}
                onCancel={closeActionSheet6}
            />
            </Modal> 
        {
            actionGallery == true ? 
            <Modal 
            isVisible={true} 
            style={{margin: 0}}
            coverScreen={false}
        >    
            <ImageViewer 
                imageUrls={img_list(images)}
                enableSwipeDown = {true}
                onSwipeDown = {closeGallery}
                index = {img_ix}
            />
        </Modal>  : null
        }
            <Modal
            isVisible={video}
            onBackdropPress={ closeVideo }
            style={{
                margin: 0,
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            coverScreen={false}
            backdropOpacity={1}
            >
        <YoutubePlayer
        width={Platform.OS === "ios" ? 'auto' : Constants.WINDOW_WIDTH}
        height={Platform.OS === "ios" ? 'auto' : Constants.WINDOW_HEIGHT}
        play={video}
        onFullScreenChange={onFullScreenChange}
        videoId={id_name}
        initialPlayerParams={{ cc_lang_pref: 'us', showClosedCaptions: true }}
        webViewProps={{
            injectedJavaScript: `
              var element = document.getElementsByClassName('container')[0];
              element.style.position = 'unset';
              element.style.paddingBottom = 'unset';
              true;
            `,
            allowsInlineMediaPlayback: false,
            onLoadStart :()=>{
                setLoad2(true);
            },
            onLoad : ()=>{
                setLoad2(false);
            }
          }}
        // prevent aspect ratio au
        onChangeState={(data)=>{
            if(data=='paused'){
                // closeVideo();
            }else if(data ='unstarted'){
                setLoad2(false);
            }
        }}
        forceAndroidAutoplay={Platform.OS === 'android'}
      />
        {  
             load2 == true  ? <UIActivityIndicator
            style={{
            flex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex:1000,
            alignItems: 'center',
            position: 'absolute',
            justifyContent: 'center' }}
            size={40} count={10}
            color='rgb(161,201,138)'
            />   : null
      }
        </Modal>
        </KeyboardAvoidingView>
    )
}
