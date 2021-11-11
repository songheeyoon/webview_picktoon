import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, AsyncStorage, Alert, Platform, BackHandler } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';


import Constants, { getCurUserIx } from '../Utils/Constant';
import HomeView from '../DrawNav/Home/HomeView';



const Drawer = createDrawerNavigator();




export default function DrawNavigation({ navigation ,route}) {
    const [initRender, setInitRender] = useState(true)

    useEffect(() => {
        setInitRender(false)
    }, [initRender])

    return (
        <Drawer.Navigator
            drawerPosition='right'
            drawerStyle={{
                width: initRender ? 0 : Constants.WINDOW_WIDTH * 0.75,
                zIndex: 999999
            }}
            initialRouteName={'home'}
            screenOptions={{
                gestureEnabled: false
            }}
        >

            {/* 메인 홈 페이지 */}
            <Drawer.Screen name="home" component={HomeView}
                initialParams={{
                    userIx: getCurUserIx(),
                    url : route.params.url
                }}
            />

        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    closeView: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 10 : 15,
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    pickView: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    apprView: {
        flex: 1,
        paddingBottom: 10,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    settingView: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    scrollImageView: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    webtoonImage: {
        borderRadius: 5,
        width: Constants.WINDOW_WIDTH * 0.3,
        height: Constants.WINDOW_WIDTH * 0.24
    },
    webtoonImageTablet: {
        borderRadius: 10,
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.15
    },
    allView: {
        flex: 1,
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH * 0.75
    },
    allViewText: {
        color: "#888",
        fontSize: 13
    },
});