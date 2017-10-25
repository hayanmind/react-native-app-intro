import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet
} from 'react-native';

const SKIP_FADE_OPACITY_INPUT_RANGE = [0, 1];
const SKIP_FADE_OPACITY_OUTPUT_RANGE = [0, 20];

export const DoneButton = ({
  styles,
  onDoneBtnClick,
  onNextBtnClick,
  rightTextColor,
  doneBtnLabel,
  nextBtnLabel,
  doneFadeOpacity,
  skipFadeOpacity,
  nextOpacity,
  allowFontScaling,
  fontSize,
  showNextButton,
}) => {
  let nextButton = null
  if ( showNextButton ) {
    nextButton = (
      <Animated.View style={[styles.full, customStyles.full, { opacity: nextOpacity }]}>
        <TouchableOpacity
          style={styles.full}
          onPress={ onNextBtnClick}
        >
         <Text
           allowFontScaling={allowFontScaling}
           style={[styles.nextButtonText, { color: rightTextColor }]}
         >
          {nextBtnLabel}
        </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.btnContainer}>
      <Animated.View
        style={[
          styles.full,
          customStyles.full,
          {
            opacity: doneFadeOpacity,
            transform: [{
              translateX: skipFadeOpacity.interpolate({
                inputRange: SKIP_FADE_OPACITY_INPUT_RANGE,
                outputRange: SKIP_FADE_OPACITY_OUTPUT_RANGE,
              }),
            }],
          }
        ]}
      >
        <TouchableOpacity
          style={styles.full}
          onPress={ onDoneBtnClick }
        >
          <Text
            allowFontScaling={allowFontScaling}
            style={[
              styles.nextButtonText,
              styles.doneButtonText,
              { color: rightTextColor, fontSize }
            ]}
          >
            {doneBtnLabel}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      {nextButton}
    </View>
  )
}

const customStyles = StyleSheet.create({
  full: {
    height: 0
  }
})

export default DoneButton
