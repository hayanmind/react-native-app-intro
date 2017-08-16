import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native';

export const Dot = ({
  styles,
  dotColor,
  activeDotColor,
  active,
  onPressDot,
  index,
  context
}) => {
  let style = [styles.dotStyle]
  if ( active ) {
    style = style.concat([styles.activeDotStyle, {backgroundColor: activeDotColor }])
  } else {
    style.push({ backgroundColor: dotColor })
  }

  return (
    <TouchableOpacity
      onPress={ () => {
        onPressDot({ index, context })
      } }
    >
      <View style={style} />
    </TouchableOpacity>
  )
}

export const RenderDots = (index, total, context, props) => {
  let dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(React.createElement(Dot, {
      ...props,
      key: i,
      active: i === index,
      index: i,
      context: context
    }));
  }
  return dots;
}

export default RenderDots;
