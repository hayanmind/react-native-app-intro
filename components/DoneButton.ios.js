import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';

export const DoneButton = ({
  styles,
  onDoneBtnClick,
  onNextBtnClick,
  rightTextColor,
  isDoneBtnShow,
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
      <Animated.View style={[styles.full, { height: 0 }, { opacity: nextOpacity }]}>
        <TouchableOpacity
          style={styles.full}
          onPress={ onNextBtnClick}
        >
         <Text
           allowFontScaling={allowFontScaling}
           style={[styles.nextButtonText, { color: rightTextColor, fontSize }]}
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
          { height: 0 },
          {
            opacity: doneFadeOpacity,
            transform: [{
              translateX: skipFadeOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
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

export default DoneButton
