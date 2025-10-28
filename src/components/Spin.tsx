import {StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import {Circle, Svg, CircleProps} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  cancelAnimation,
  Easing,
  useAnimatedProps,
  interpolate,
} from 'react-native-reanimated';
import useReadStore from '../stores';

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spin__icon: {
    display: 'flex',
    width: 120,
    height: 120,
  },
  spin__icon__main: {
    display: 'flex',
    width: 120,
    height: 120,
  },
});

// step 1: 初始化 动画组件 circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Spin = () => {
  // step 2: 初始化动画帧
  const numAni = useSharedValue(0);
  const loading = useReadStore(state => state.loading);

  // step 3.1 初始化 view 动画样式变化
  const animatedViewStyle = useAnimatedStyle(() => {
    const rotate = interpolate(numAni.value, [0, 1], [0, 360]);
    return {
      transform: [{rotate: `${rotate}deg`}],
    };
  });
  // step 3.2 初始化 circle 动画属性变化
  const animatedCircleProps = useAnimatedProps<CircleProps>(() => {
    const strokeDashoffset = interpolate(
      numAni.value,
      [0, 0.5, 1],
      [187, 46.75, 187],
    );
    return {
      strokeDashoffset,
    };
  });
  // step 3.3 初始化 circle 动画样式变化
  const animatedCircleStyle = useAnimatedStyle(() => {
    const rotate = interpolate(numAni.value, [0, 0.5, 1], [0, 90, 360]);
    return {
      transform: [{rotate: `${rotate}deg`}],
    };
  });

  // step 4 描述动画
  useEffect(() => {
    numAni.value = withRepeat(
      withTiming(1, {duration: 1400, easing: Easing.inOut(Easing.ease)}),
      -1,
      false,
    );
    return () => {
      cancelAnimation(numAni);
      numAni.value = 0;
    };
  }, [numAni]);

  // step 4 渲染
  return (
    <View className={loading ? 'absolute top-0 left-0 w-full h-full bg-gray-500 flex flex-col justify-center items-center opacity-50' : 'hidden'}>
      <Animated.View
        style={[
          styles.spin__icon,
          animatedViewStyle,
        ]}>
        <Animated.View style={[styles.spin__icon__main, animatedCircleStyle]}>
          <Svg width="100%" height="100%" viewBox="0 0 60 60">
            <AnimatedCircle
              animatedProps={animatedCircleProps}
              fill="none"
              strokeWidth={6}
              strokeLinecap="round"
              cx={30}
              cy={30}
              r={27}
              strokeDasharray={187}
              strokeDashoffset={46.75}
              stroke="#fac200"
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Spin;
