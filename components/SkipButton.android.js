import React from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';

export const SkipButton = ({
  styles, onSkipBtnClick, isSkipBtnShow,
  leftTextColor,
  skipBtnLabel,
  allowFontScaling,
  fontSize
}) => {
  return (
    <View style={[styles.btnContainer, {
        paddingBottom: 5,
        opacity: isSkipBtnShow ? 1 : 0,
      }]}>
      <TouchableOpacity
        style={styles.full}
        onPress={isSkipBtnShow ? () => onSkipBtnClick() : null}>
        <Text allowFontScaling={allowFontScaling} style={[styles.controlText, { color: leftTextColor, fontSize }]}>
          {skipBtnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SkipButton
