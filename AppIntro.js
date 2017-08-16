import assign from 'assign-deep';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import DoneButton from './components/DoneButton';
import SkipButton from './components/SkipButton';
import RenderDots from './components/Dots';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

const defaultStyles = {
  container: {
    flex: 1
  },
  header: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pic: {
    width: 150,
    height: 150,
  },
  info: {
    flex: 0.5,
    alignItems: 'center',
    padding: 30,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: 20,
  },
  description: {
    color: '#fff',
    fontSize: 20,
  },
  controllText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  nextButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  full: {
    height: 80,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedPage: {
    position: 'absolute',
    height: windowsHeight,
    width: windowsWidth,
    top: 0,
  }
}

export default class AppIntro extends Component {
  constructor(props) {
    super(props);

    this.styles = StyleSheet.create(assign({}, defaultStyles, props.customStyles));

    this.state = {
      skipFadeOpacity: new Animated.Value(1),
      doneFadeOpacity: new Animated.Value(0),
      nextOpacity: new Animated.Value(1),
      showNextButton: true,
      parallax: new Animated.Value(0),
      index: props.defaultIndex
    };

    this.state.nextOpacity.addListener( ({ value }) => {
      if ( value === 0 && this.state.showNextButton ) {
        this.setState({ showNextButton: false })
      } else if ( value > 0 && !this.state.showNextButton ) {
        this.setState({ showNextButton: true })
      }
    })

    this.bindFunctions()
  }

  bindFunctions() {
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    this.onPageScroll = this.onPageScroll.bind(this)
    this.onSkipBtnClick = this.onSkipBtnClick.bind(this)
  }

  onNextBtnClick = (context) => {
    if (context.state.isScrolling || context.state.total < 2) return;
    const state = context.state;
    const diff = (context.props.loop ? 1 : 0) + 1 + context.state.index;
    let x = 0;
    if (state.dir === 'x') x = diff * state.width;
    if (Platform.OS === 'ios') {
      context.refs.scrollView.scrollTo({ y: 0, x });
    } else {
      context.refs.scrollView.setPage(diff);
      context.onScrollEnd({
        nativeEvent: {
          position: diff,
        },
      });
    }
    this.props.onNextBtnClick(context.state.index);
  }

  setDoneBtnOpacity = (value) => {
    Animated.timing(
      this.state.doneFadeOpacity,
      { toValue: value },
    ).start();
  }

  setSkipBtnOpacity = (value) => {
    Animated.timing(
      this.state.skipFadeOpacity,
      { toValue: value },
    ).start();
  }

  setNextOpacity = (value) => {
    Animated.timing(
      this.state.nextOpacity,
      { toValue: value },
    ).start();
  }

  getTransform = (index, offset, level, calcTransformForOpacity = true) => {
    const isFirstPage = index === 0;
    const xStatRange = isFirstPage ? 0 : index - 1;
    const xEndRange = isFirstPage ? 1 : index;

    const leftPosition = isFirstPage ? 0 : windowsWidth / 3;
    const rightPosition = isFirstPage ? -windowsWidth / 3 : 0;

    let transform = [{
      transform: [
        {
          translateX: this.state.parallax.interpolate({
            inputRange: [xStatRange, xEndRange],
            outputRange: [
              isFirstPage ? leftPosition : leftPosition - (offset * level),
              isFirstPage ? rightPosition + (offset * level) : rightPosition,
            ],
          }),
        }],
    }];

    if ( calcTransformForOpacity === true ) {
      const startOpacity = isFirstPage ? 1 : 0;
      const endOpacity = 1;

      transform.push({
        opacity: this.state.parallax.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [startOpacity, endOpacity, 0]
        }),
      })
    }

    return {
      transform,
    };
  }

  onPressDot = ({ index, context }) => {
    this.setState({ index })
    if ( Platform.OS === 'android' ) {
      context.refs.scrollView.setPage(index);
      context.onScrollEnd({
        nativeEvent: {
          position: index,
        },
      });
    }
  }

  renderDots(index, total, context) {
    if (!this.props.showDots)
      return null
    return (
      <View style={this.styles.dotsContainer}>
        {
          RenderDots(index, total, context, {
            ...this.props,
            styles: this.styles,
            onPressDot: this.onPressDot
          })
        }
      </View>
    )
  }

  onSkipBtnClick() {
    if ( this.props.onSkipBtnClick )
      this.props.onSkipBtnClick(this.state.index)
  }

  renderPagination = (index, total, context) => {
    let isDoneBtnShow;
    let isSkipBtnShow;

    if (index === total - 1) {
      this.setDoneBtnOpacity(1);
      this.setSkipBtnOpacity(0);
      this.setNextOpacity(0);
      isDoneBtnShow = true;
      isSkipBtnShow = false;
    } else {
      this.setDoneBtnOpacity(0);
      this.setSkipBtnOpacity(1);
      this.setNextOpacity(1);
      isDoneBtnShow = false;
      isSkipBtnShow = true;
    }
    return (
      <View style={this.styles.paginationContainer}>
        {this.props.showSkipButton ? <SkipButton
          {...this.props}
          {...this.state}
          isSkipBtnShow={isSkipBtnShow}
          styles={this.styles}
          onSkipBtnClick={this.onSkipBtnClick} /> :
          <View style={this.styles.btnContainer} />
        }
        {this.renderDots(index, total, context)}
        {this.props.showDoneButton ? <DoneButton
            {...this.props}
            {...this.state}
            isDoneBtnShow={isDoneBtnShow}
            styles={this.styles}
            onNextBtnClick={this.onNextBtnClick.bind(this, context)}
            onDoneBtnClick={this.props.onDoneBtnClick} /> :
            <View style={this.styles.btnContainer} />
          }
      </View>
    );
  }

  renderBasicSlidePage = (index, {
    title,
    description,
    img,
    imgStyle,
    backgroundColor,
    fontColor,
    level,
  }) => {
    const AnimatedStyle1 = this.getTransform(index, 10, level);
    const AnimatedStyle2 = this.getTransform(index, 0, level);
    const AnimatedStyle3 = this.getTransform(index, 15, level);
    const imgSource = (typeof img === 'string') ? {uri: img} : img;
    const pageView = (
      <View style={[this.styles.slide, { backgroundColor }]} showsPagination={false} key={index}>
        <Animated.View style={[this.styles.header, ...AnimatedStyle1.transform]}>
          <Image style={imgStyle} source={imgSource} />
        </Animated.View>
        <View style={this.styles.info}>
          <Animated.View style={AnimatedStyle2.transform}>
            <Text style={[this.styles.title, { color: fontColor }]}>{title}</Text>
          </Animated.View>
          <Animated.View style={AnimatedStyle3.transform}>
            <Text style={[this.styles.description, { color: fontColor }]}>{description}</Text>
          </Animated.View>
        </View>
      </View>
    );
    return pageView;
  }

  renderChild = (children, pageIndex, index) => {
    const level = children.props.level || 0;
    const root = children.props.children;
    let nodes = children;
    if (Array.isArray(root)) {
      nodes = root.map((node, i) => this.renderChild(node, pageIndex, `${index}_${i}`));
    }
    let animatedChild = null;
    if (level !== 0) {
      const { transform } = this.getTransform(pageIndex, 10, level);
      animatedChild = (
        <Animated.View
          key={index}
          style={[children.props.style, transform]}
        >
          {nodes}
        </Animated.View>
      );
    } else {
      animatedChild = (
        <View
          key={index}
          style={children.props.style}
        >
          {nodes}
        </View>
      );
    }
    return animatedChild;
  }

  shadeStatusBarColor(color, percent) {
    const first = parseInt(color.slice(1), 16);
    const black = first & 0x0000FF;
    const green = first >> 8 & 0x00FF;
    const percentage = percent < 0 ? percent * -1 : percent;
    const red = first >> 16;
    const theme = percent < 0 ? 0 : 255;
    const finalColor = (0x1000000 + (Math.round((theme - red) * percentage) + red) * 0x10000 + (Math.round((theme - green) * percentage) + green) * 0x100 + (Math.round((theme - black) * percentage) + black)).toString(16).slice(1);

    return `#${finalColor}`;
  }

  isToTintStatusBar() {
    return this.props.pageArray && this.props.pageArray.length > 0 && Platform.OS === 'android'
  }

  onMomentumScrollEnd(e, state) {
    if (this.isToTintStatusBar()) {
      StatusBar.setBackgroundColor(this.shadeStatusBarColor(this.props.pageArray[state.index].backgroundColor, -0.3), false);
    }

    this.setState({ index: state.index })
    this.props.onSlideChange(state.index, state.total);
  }

  onPageScroll(e) {
    this.state.parallax.setValue(e.nativeEvent.offset + e.nativeEvent.position)
  }

  render() {
    const childrens = this.props.children;
    const { pageArray } = this.props;
    let pages = [];
    let androidPages = null;
    if (pageArray.length > 0) {
      pages = pageArray.map((page, i) => this.renderBasicSlidePage(i, page));
    } else {
      if (Platform.OS === 'ios') {
        pages = childrens.map((children, i) => this.renderChild(children, i, i));
      } else {
        pages = childrens.map((children, i) => {
          const { transform } = this.getTransform(i, windowsWidth * 1 / 3 , 1, false);
          return (
            <Animated.View
              key={i}
              style={[
                this.styles.animatedPage,
                { ...transform[0] }
              ]}
            >
              {this.renderChild(children, i, i)}
            </Animated.View>
          );
        });
      }
    }

    if (this.isToTintStatusBar()) {
      StatusBar.setBackgroundColor(this.shadeStatusBarColor(this.props.pageArray[0].backgroundColor, -0.3), false);
    }

    return (
      <View style={this.styles.container}>
        <Swiper
          loop={false}
          index={this.state.index}
          renderPagination={this.renderPagination}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScroll={Animated.event(
            [{ x: this.state.parallax }]
          )}
          onPageScroll={this.onPageScroll}
        >
          {pages}
        </Swiper>
      </View>
    );
  }
}

AppIntro.propTypes = {
  dotColor: PropTypes.string,
  activeDotColor: PropTypes.string,
  rightTextColor: PropTypes.string,
  leftTextColor: PropTypes.string,
  onSlideChange: PropTypes.func,
  onSkipBtnClick: PropTypes.func,
  onDoneBtnClick: PropTypes.func,
  onNextBtnClick: PropTypes.func,
  pageArray: PropTypes.array,
  doneBtnLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  skipBtnLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  nextBtnLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  customStyles: PropTypes.object,
  defaultIndex: PropTypes.number,
  showSkipButton: PropTypes.bool,
  showDoneButton: PropTypes.bool,
  showDots: PropTypes.bool,
  allowFontScaling: PropTypes.bool,
  fontSize: PropTypes.number
};

AppIntro.defaultProps = {
  dotColor: 'rgba(255,255,255,.3)',
  activeDotColor: '#fff',
  rightTextColor: '#fff',
  leftTextColor: '#fff',
  pageArray: [],
  onSlideChange: () => {},
  onSkipBtnClick: () => {},
  onDoneBtnClick: () => {},
  onNextBtnClick: () => {},
  doneBtnLabel: 'Done',
  skipBtnLabel: 'Skip',
  nextBtnLabel: '›',
  defaultIndex: 0,
  showSkipButton: true,
  showDoneButton: true,
  showDots: true,
  allowFontScaling: true,
  fontSize: 22,
  skipButtonOutputRange: [0, 15]
};
