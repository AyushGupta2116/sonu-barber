import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FloatingParticles from './components/FloatingParticles';
import GlowOrbs from './components/GlowOrbs';
import SpotifyPlayer from './components/SpotifyPlayer';

const PLAYLIST_ID = '5AWPibtqW7T2ztILARMhlA';
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const INSTAGRAM_HANDLE = 'ayussssssssh.21';
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

const COLORS = {
  bg: '#170A03',
  amber: '#F5A623',
  red: '#B3282D',
  glass: 'rgba(35,19,9,0.55)',
  glassBorder: 'rgba(245,166,35,0.3)',
  cream: '#FBF1DE',
  fade: 'rgba(251,241,222,0.62)',
};

function BarberPole({ height = 44, width = 12 }) {
  const scroll = useRef(new Animated.Value(0)).current;
  const stripeGap = 10;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(scroll, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [scroll]);

  const translateY = scroll.interpolate({ inputRange: [0, 1], outputRange: [0, stripeGap] });
  const innerHeight = height + stripeGap * 3;
  const stripeCount = Math.ceil(innerHeight / stripeGap) + 2;

  return (
    <View style={[styles.poleCylinder, { height, width }]}>
      <Animated.View
        style={{
          position: 'absolute',
          left: -width * 0.6,
          right: -width * 0.6,
          top: -stripeGap,
          transform: [{ translateY }],
        }}
      >
        {Array.from({ length: stripeCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.poleStripe,
              { top: i * stripeGap, backgroundColor: i % 2 === 0 ? COLORS.red : '#1E3A8B' },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function TimePill() {
  const now = useClock();
  let h = now.getHours();
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const mm = String(now.getMinutes()).padStart(2, '0');
  const colonOn = now.getSeconds() % 2 === 0;

  return (
    <View style={styles.timePill}>
      <Text style={styles.timeText}>
        {h}
        <Text style={{ opacity: colonOn ? 1 : 0.2 }}>:</Text>
        {mm}
      </Text>
      <Text style={styles.timePeriod}> {period}</Text>
    </View>
  );
}

function LivePill() {
  const [listeners, setListeners] = useState(214);
  const ping = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(ping, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [ping]);

  useEffect(() => {
    const id = setInterval(() => {
      setListeners((n) => Math.max(80, n + Math.round((Math.random() - 0.5) * 14)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const scale = ping.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const opacity = ping.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });

  return (
    <View style={styles.livePill}>
      <View style={styles.dotWrap}>
        <Animated.View style={[styles.dotPing, { transform: [{ scale }], opacity }]} />
        <View style={styles.dotCore} />
      </View>
      <Text style={styles.liveNumber}>{listeners}</Text>
      <Text style={styles.liveLabel}> sun rahe hain</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={StyleSheet.absoluteFill}>
        <GlowOrbs />
        <FloatingParticles />
      </View>

      <View style={styles.topbar}>
        <TimePill />
        <LivePill />
      </View>

      <ScrollView
        contentContainerStyle={styles.center}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <BarberPole />
          <View style={styles.brandTextWrap}>
            <Text style={styles.brand}>SALON WALA</Text>
            <Text style={styles.brandHindi}>सैलून वाला</Text>
          </View>
          <BarberPole />
        </View>
        <Text style={styles.tagline}>✂️ Sonu Hair Salon Radio — purane gaane, non-stop 💈</Text>

        <View style={styles.playerCard}>
          <SpotifyPlayer playlistId={PLAYLIST_ID} style={styles.spotifyEmbed} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.spotifyLink, pressed && styles.spotifyLinkPressed]}
          onPress={() => Linking.openURL(PLAYLIST_URL)}
        >
          <Text style={styles.spotifyLinkText}>Skip not working? Open in Spotify ↗</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.igPill, pressed && styles.igPillPressed]}
          onPress={() => Linking.openURL(INSTAGRAM_URL)}
        >
          <Text style={styles.igPillText}>📸 @{INSTAGRAM_HANDLE}</Text>
        </Pressable>

        <Text style={styles.footerCredit}>
          💈 Sonu Hair Salon — jahan katting aur gaana saath chalta hai
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 6,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timePeriod: {
    color: COLORS.fade,
    fontSize: 11,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  dotWrap: {
    width: 9,
    height: 9,
  },
  dotPing: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.amber,
  },
  dotCore: {
    position: 'absolute',
    width: 7,
    height: 7,
    top: 1,
    left: 1,
    borderRadius: 4,
    backgroundColor: COLORS.amber,
  },
  liveNumber: {
    color: COLORS.amber,
    fontWeight: '700',
    fontSize: 13,
  },
  liveLabel: {
    color: COLORS.fade,
    fontSize: 12,
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  brandTextWrap: {
    alignItems: 'center',
  },
  poleCylinder: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: '#8A8A8A',
  },
  poleStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    transform: [{ rotate: '35deg' }],
  },
  brand: {
    color: COLORS.cream,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandHindi: {
    color: COLORS.amber,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  tagline: {
    color: COLORS.fade,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 22,
    textAlign: 'center',
  },
  spotifyLink: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  spotifyLinkPressed: {
    opacity: 0.7,
  },
  spotifyLinkText: {
    color: COLORS.amber,
    fontSize: 12,
    fontWeight: '600',
  },
  igPill: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  igPillPressed: {
    opacity: 0.7,
  },
  igPillText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  playerCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
  },
  spotifyEmbed: {
    width: '100%',
    height: 500,
    borderRadius: 12,
  },
  footerCredit: {
    textAlign: 'center',
    color: COLORS.fade,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 20,
    paddingHorizontal: 24,
  },
});
