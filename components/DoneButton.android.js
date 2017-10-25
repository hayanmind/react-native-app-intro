import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export const DoneButton = ({
  styles, onDoneBtnClick, onNextBtnClick,
  rightTextColor, isDoneBtnShow,
  doneBtnLabel, nextBtnLabel,
  allowFontScaling, fontSize
}) => {
  let styleText = [styles.nextButtonText]
  if ( isDoneBtnShow ) {
    styleText = styleText.concat([ styles.doneButtonText, { fontSize: fontSize } ])
  }
  styleText.push({ color: rightTextColor })

  return (
    <View style={[styles.btnContainer, customStyles.btnContainer]}>
      <TouchableOpacity style={styles.full}
        onPress={ isDoneBtnShow ? onDoneBtnClick : onNextBtnClick }
      >
       <Text
         allowFontScaling={allowFontScaling}
         style={styleText}
        >
         {isDoneBtnShow ? doneBtnLabel : nextBtnLabel}
       </Text>
      </TouchableOpacity>
    </View>
  )
}

const customStyles = StyleSheet.create({
  btnContainer: {
    height: 0,
    paddingBottom: 5
  }
})

export default DoneButton
