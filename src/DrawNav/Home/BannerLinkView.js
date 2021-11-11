import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Image, Animated, Easing, Keyboard } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import Constants, { topPadding, getCurUserIx, StatusBarHeight } from '../../Utils/Constant';

import RestAPI from '../../Utils/RestAPI';

import { CommonActions } from '@react-navigation/native';
import { UIActivityIndicator } from 'react-native-indicators';

// 웹툰 프로필 페이지
export default function BannerLinkView({ route, navigation }) {
    const [show,setShow] = useState('flex');
    const [data,setData] = useState();
    const [faqList, setFaqList] = useState()
    const [load,setLoad] = useState(true)

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WebView 
                style={{marginTop: show == false ? 0:StatusBarHeight}}
                source={{ uri:route.params.link }}
                decelerationRate={100} // 속도 높이려고 추가
                javaScriptEnabled={true}
                onMessage={(event)=>{
                    const data = JSON.parse(event.nativeEvent.data)
                    console.log(data);
                    if(data.type == 'close'){
                        // console.log('abc');
                        navigation.goBack();
                    }
                }}
                onLoadStart={()=>{
                    setLoad(true)
                }}
                onLoad={()=>{
                    setLoad(false)
                }}
            />
                            {load ?
                    <UIActivityIndicator
                    style={{
                    flex: 1,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center' }}
                    size={25} count={10}
                    />   
                :null}
            {/* <BottomBar navigation={navigation} selTab={route.params.selTabIndex} name={show}/>   */}
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 140 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bottomToolBarHidden: {
        margin: 0,
        position: 'absolute',
        bottom: 70,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA'
    },
    bottomToolBarHiddenAndroid: {
        margin: 0,
        position: 'absolute',
        bottom: 50,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA',
        borderBottomColor: 'white'
    },
    directionIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: Constants.WINDOW_WIDTH,
    },
})