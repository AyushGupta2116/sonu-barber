import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

const GLYPHS = ['✂️', '💈', '🪮', '✂️', '💇'];

function Particle({ left, glyph, duration, delay, size }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 640],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '340deg'],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.85, 1],
    outputRange: [0, 0.55, 0.55, 0],
  });

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          left,
          fontSize: size,
          opacity,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    >
      {glyph}
    </Animated.Text>
  );
}

export default function FloatingParticles({ count = 9 }) {
  const particles = Array.from({ length: count }).map((_, i) => ({
    left: `${(i * 97) % 100}%`,
    glyph: GLYPHS[i % GLYPHS.length],
    duration: 9000 + (i % 5) * 1400,
    delay: i * 650,
    size: 14 + (i % 3) * 4,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
  },
});
