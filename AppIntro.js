import assign from 'assign-deep';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
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

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

const defaultStyles = {
  container: {
    flex: 1
  },
  controlText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dotStyle: {
    backgroundColor: 'white',
    borderColor: '#c6c6c6',
    borderWidth: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  activeDotStyle: {
    backgroundColor: '#757575',
    borderWidth: 0,
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
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginRight: 15,
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

export default class AppIntro extends PureComponent {
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
    this.onScroll = this.onScroll.bind(this)
  }

  scrollToIndex(context, index = null) {
    if (context.state.isScrolling || context.state.total < 2) return;
    const state = context.state;
    if ( index == null )
      index = 1 + context.state.index
    if ( index > context.state.total - 1 )
      return
    const diff = (context.props.loop ? 1 : 0) + index;
    let x = 0;
    if (state.dir === 'x') x = diff * state.width;
    if (IS_IOS) {
      context.scrollView.scrollTo({ y: 0, x });
    } else {
      context.scrollView.setPage(diff);
      context.onScrollEnd({
        nativeEvent: {
          position: diff,
        },
      });
    }
  }

  onNextBtnClick = (context) => {
    this.scrollToIndex(context);
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
    if ( IS_ANDROID )
      this.setState({ index });
    this.scrollToIndex(context, index);
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

  onMomentumScrollEnd(e, state) {
    this.setState({ index: state.index })
    this.props.onSlideChange(state.index, state.total);
  }

  onPageScroll(e) {
    this.state.parallax.setValue(e.nativeEvent.offset + e.nativeEvent.position)
  }

  onScroll(e) {
    let x = null
    if ( IS_IOS )
      x = e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
    else
      x = e.nativeEvent.x

    this.state.parallax.setValue(x)
  }

  render() {
    const childrens = this.props.children;
    let pages = [];
    let androidPages = null;
    if (IS_IOS) {
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

    return (
      <Swiper
        loop={false}
        index={this.state.index}
        renderPagination={this.renderPagination}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        onScroll={this.onScroll}
        onPageScroll={this.onPageScroll}
        scrollEventThrottle={16}
        containerStyle={this.styles.container}
      >
        {pages}
      </Swiper>
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
