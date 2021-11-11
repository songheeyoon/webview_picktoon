import React from 'react';
import { TouchableOpacity,View,Text,StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { isIPhoneX } from '../../Utils/Constant';

// const PRIMAY_COLOR = '#2d2d2d';
// const BORDER_COLOR = "#DBDBDB";
// const FONT_COLOR = '#a51147';
// 액션 시트 아래 메뉴 팝업 
const ActionSheet = (props) => {

    const {actionItems} = props;

  const actionSheetItems = [
    ...actionItems,
    {
      id: '#cancel',
      label: '취소',
      onPress: props?.onCancel
    }
  ]
    return(
        <View>
            {
                actionSheetItems.map((actionItem,index)=>{
                    return(
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={[
                                styles.actionSheetView,
                                index === 0 && {
                                    borderTopLeftRadius : 12,
                                    borderTopRightRadius : 12
                                },
                                index === actionSheetItems.length - 2 && {
                                    borderBottomLeftRadius: 12,
                                    borderBottomRightRadius: 12                          
                                },
                                index === actionSheetItems.length - 1 && {
                                    borderBottomWidth: 0,
                                    backgroundColor: '#ffffff',
                                    marginTop: 8,
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    borderBottomLeftRadius: 12,
                                    borderBottomRightRadius: 12,
                                    marginBottom : isIPhoneX()  ?  30 : 0 
                                }]}
                            underlayColor={'#f7f7f7'}
                            key={index}
                            onPress={actionItem.onPress}    
                        >
                        <Text allowFontScaling={false}
                            style={[styles.actionSheetText,                            
                                props?.actionTextColor && { 
                                    color : props?.actionTextColor 
                                },
                                index === 0 &&{
                                    color : '#000'
                                },
                                index === actionSheetItems.length - 1 && {
                                    color : '#FF1E1E',
                                },
                                actionItem.label === "즐겨찾기 삭제하기" && {
                                    color : "#FF1E1E"
                                }
                            ]}
                        >
                            {actionItem.label}
                        </Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    modalContent: {
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 20,
    },
    actionSheetText: {
      fontSize: 18,
      color: '#000'
    },
    actionSheetView: {
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
    //   가는 선의 너비?.. 두 요소 사이의 경계 구분.
    //   borderColor: '#ccc'
    }
  });

  ActionSheet.propTypes = {
    actionItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        label: PropTypes.string,
        onPress: PropTypes.func
      })
    ).isRequired,
    onCancel: PropTypes.func,
    actionTextColor: PropTypes.string
  }
  
//   기본값 설정.
  ActionSheet.defaultProps = {
    actionItems: [],
    onCancel: () => { },
    actionTextColor: null
  }

export default ActionSheet;
