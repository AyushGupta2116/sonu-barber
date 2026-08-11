import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

function Orb({ style, color, duration }) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [drift, duration]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const scale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });

  return (
    <Animated.View
      style={[
        styles.orb,
        style,
        { backgroundColor: color, transform: [{ translateX }, { translateY }, { scale }] },
      ]}
    />
  );
}

export default function GlowOrbs() {
  return (
    <>
      <Orb
        style={{ top: '10%', left: '8%', width: 220, height: 220 }}
        color="rgba(245,166,35,0.16)"
        duration={5200}
      />
      <Orb
        style={{ bottom: '16%', right: '6%', width: 260, height: 260 }}
        color="rgba(62,143,99,0.16)"
        duration={6400}
      />
    </>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
});
