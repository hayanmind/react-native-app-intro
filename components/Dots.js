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
  index
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
        onPressDot({ index })
      } }
    >
      <View style={style} />
    </TouchableOpacity>
  )
}

export const RenderDots = (index, total, props) => {
  let dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(React.createElement(Dot, {
      ...props,
      key: i,
      active: i === index,
      index: i
    }));
  }
  return dots;
}

export default RenderDots;
