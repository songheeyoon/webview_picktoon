// 회원가입 동의 스크린
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Linking,Image } from 'react-native';
import Constants from '../Utils/Constant';
import { CheckBox } from 'react-native-elements'
import '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import messaging from '@react-native-firebase/messaging';

// 회원가입동의 페이지
export default function SignupAgreeScreen({ navigation }) {
    const [isSelectedAll, setSelectionAll] = useState(false);
    const [isSelectedPerson, setSelectionPerson] = useState(false);
    const [isSelectedService, setSelectionService] = useState(false);
    // const [isSelectedPersonAdd, setSelectionPersonAdd] = useState(false);
    const [isSelectedAdb, setSelectionAdb] = useState(false);

    const _checkNotificationStatus = async () => {
        const authorizationStatus = await messaging().requestPermission();
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
           
            return true;
          }else{
                Alert.alert(
                    '오류',
                    '픽툰알림 허용을 하지 않고서는 픽툰 혜택 및 광고성알림을 받을수 없습니다. 지금 설정하시겠습니까?',
                    [
                        {
                            text: '취소',
                            onPress: () => {
                                setSelectionAdb(false)
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

    const checkAgree = async () => {
        if (!isSelectedPerson) {
            Alert.alert('오류', '개인정보취급방법에 동의해주세요!', [{ text: '확인' }])
            return
        } else if (!isSelectedService) {
            Alert.alert('오류', '서비스 이용약관에 동의해주세요!', [{ text: '확인' }])
            return
        } else if (isSelectedAdb) {
            let status = await _checkNotificationStatus()
            if (!status) return
        }
        global.selectedAdb = isSelectedAdb
        setSelectionAll(false)
        setSelectionPerson(false)
        setSelectionService(false)
        // setSelectionPersonAdd(false)
        setSelectionAdb(false)
        console.log(isSelectedAdb);
        navigation.navigate('signup',{agree:isSelectedAdb})
    }

    return (
        <View style={styles.container}>
            <View style={styles.topView}>
                <Text style={styles.title}>회원가입을 위해 약관에 동의해주세요.</Text>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.subTopView}>
                    <View style={styles.allCheckBoxView}>
                        <CheckBox
                            checkedColor='#A1C98A'
                            checked={isSelectedAll}
                            checkedIcon={<Image source={require('../../assets/images/checked.png')} style={{resizeMode: "contain", width: 25,height:25}} />}
                            uncheckedIcon={<Image source={require('../../assets/images/uncheck.png')} style={{resizeMode: "contain", width: 25,height:25}} />}
                            onPress={() => {
                                if (isSelectedAll) {
                                    setSelectionAll(false)
                                    setSelectionPerson(false)
                                    setSelectionService(false)
                                    // setSelectionPersonAdd(false)
                                    setSelectionAdb(false)
                                } else {
                                    setSelectionAll(true)
                                    setSelectionPerson(true)
                                    setSelectionService(true)
                                    // setSelectionPersonAdd(true)
                                    setSelectionAdb(true)
                                }
                            }}
                            containerStyle={{
                                backgroundColor: 'transparent', borderColor: 'transparent', padding: 0,width:25
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (isSelectedAll) {
                                    setSelectionAll(false)
                                    setSelectionPerson(false)
                                    setSelectionService(false)
                                    // setSelectionPersonAdd(false)
                                    setSelectionAdb(false)
                                } else {
                                    setSelectionAll(true)
                                    setSelectionPerson(true)
                                    setSelectionService(true)
                                    // setSelectionPersonAdd(true)
                                    setSelectionAdb(true)
                                }
                            }}
                        >
                            <Text style={{ color: '#707070', fontSize: 16, fontWeight: 'bold',lineHeight:30}}>모두 동의합니다.</Text>
                            <Text style={{ color: '#707070', fontSize: 10 }}>전체동의는 필수 및 선택정보에 대한 동의도 포함되며</Text>
                            <Text style={{ color: '#707070', fontSize: 10 }}>개별적으로 동의를 선택할 수 있습니다.</Text>
                            <Text style={{ color: '#707070', fontSize: 10 }}>선택항목에 대한 동의를 거부하는 경우에도 서비스 이용이 가능합니다</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%" }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    checkedIcon={<Image source={require('../../assets/images/checked.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    uncheckedIcon={<Image source={require('../../assets/images/uncheck.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    size={28}
                                    checked={isSelectedPerson}
                                    onPress={() => {
                                        if (isSelectedPerson) {
                                            setSelectionPerson(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionPerson(true)
                                            if (isSelectedService && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />     
                                <View style={{ flexDirection: 'row', width:"83%",alignItems:'center',justifyContent:'space-between'}}>               
                                <TouchableOpacity onPress={()=>{                                                                     
                                    if (isSelectedPerson) {
                                        setSelectionPerson(false)
                                        setSelectionAll(false)
                                    } else {
                                        setSelectionPerson(true)
                                        if (isSelectedService && isSelectedAdb) {
                                            setSelectionAll(true)
                                        }   
                                    }
                                                                        
                                }}>
                                    <Text style={{ color: '#707070', fontSize: 14 }}>개인정보 처리방침(필수)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                     navigation.navigate('webview', { link:'https://picktoon.com/policy_info.html'})
                                    // Linking.openURL('https://picktoon.com/policy_info.html');
                                }} style={{alignItems:'flex-end'}}>
                                    <Text style={{ color: '#707070', fontSize: 10 }}>보기</Text>
                                </TouchableOpacity>
                                </View>     
                            </View>
                        </View>
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    checkedIcon={<Image source={require('../../assets/images/checked.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    uncheckedIcon={<Image source={require('../../assets/images/uncheck.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    size={28}
                                    checked={isSelectedService}
                                    onPress={() => {
                                        if (isSelectedService) {
                                            setSelectionService(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionService(true)
                                            if (isSelectedPerson && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />
                                <View style={{ flexDirection: 'row', width:"83%",alignItems:'center',justifyContent:'space-between'}}>               
                                    <TouchableOpacity onPress={()=>{
                                        if (isSelectedService) {
                                            setSelectionService(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionService(true)
                                            if (isSelectedPerson && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}>
                                        <Text style={{ color: '#707070', fontSize: 14 }}>서비스 이용약관(필수)</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate('webview', { link:'https://picktoon.com/policy_use.html'})
                                    // Linking.openURL('https://picktoon.com/policy_use.html');
                                    }} style={{alignItems:'flex-end'}}>
                                        <Text style={{ color: '#707070', fontSize: 10,alignSelf:'center' }}>보기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    checkedIcon={<Image source={require('../../assets/images/checked.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    uncheckedIcon={<Image source={require('../../assets/images/uncheck.png')} style={{resizeMode: "contain", width: 25,height:25}}/>}
                                    size={28}
                                    checked={isSelectedAdb}
                                    onPress={() => {
                                        if (isSelectedAdb) {
                                            setSelectionAdb(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionAdb(true)
                                            if (isSelectedService && isSelectedPerson) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />
                                <View style={{ flexDirection: 'row', width:"83%",alignItems:'center',justifyContent:'space-between'}}>               
                                    <TouchableOpacity onPress={()=>{
                                            if (isSelectedAdb) {
                                                setSelectionAdb(false)
                                                setSelectionAll(false)
                                            } else {
                                                setSelectionAdb(true)
                                                if (isSelectedService && isSelectedPerson) {
                                                    setSelectionAll(true)
                                                }
                                            }                                        
                                    }}>
                                        <Text style={{ color: '#707070', fontSize: 14 }}>신작 및 광고,이벤트 정보 수신(선택)</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{
                                        navigation.navigate('webview', { link:'https://picktoon.com/policy_event.html'})
                                        // Linking.openURL('https://picktoon.com/policy_event.html');
                                    }} style={{alignItems:'flex-end'}}>
                                        <Text style={{ color: '#707070', fontSize: 10,alignSelf:'center' }}>보기</Text>
                                    </TouchableOpacity>
                                </View>    
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={() => {
                                checkAgree()
                            }}
                            style={styles.bottomBannerView}
                        >
                            <Text style={styles.nextBtn}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    topView: {
        height: Constants.WINDOW_HEIGHT * 0.3,
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
    bottomBannerView: {
        backgroundColor: '#A1C98A',
        width: Constants.WINDOW_WIDTH * 0.8,
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 15,
        marginBottom: 30,
        borderRadius: 5
    },
    nextBtn: {
        color: 'white',
        fontSize: 16,
    },
    title: { color: '#000', fontSize: 18, paddingTop: 50, fontWeight: 'bold' },
    subTopView: { flex: 1, justifyContent: 'space-between', paddingBottom: 50 },
    allCheckBoxView: {
        width: Constants.WINDOW_WIDTH,
        paddingHorizontal: 10,
        paddingVertical: 10,
        // borderColor: '#DDD',
        // borderBottomWidth: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    generalCheckBoxView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 20,
        width: Constants.WINDOW_WIDTH
    },



})