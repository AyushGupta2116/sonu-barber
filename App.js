import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FloatingParticles from './components/FloatingParticles';
import GlowOrbs from './components/GlowOrbs';
import Player from './components/Player';
import { SONGS } from './data/songs';

const COLORS = {
  bg: '#170A03',
  bgDeep: '#0F0602',
  amber: '#F5A623',
  amberDeep: '#D9860F',
  green: '#3E8F63',
  glass: 'rgba(35,19,9,0.55)',
  glassBorder: 'rgba(245,166,35,0.3)',
  cream: '#FBF1DE',
  fade: 'rgba(251,241,222,0.62)',
  ink: '#1D0F05',
};

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

function Vinyl({ size = 96 }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const ring = (ratio, borderColor) => {
    const d = size * ratio;
    return {
      position: 'absolute',
      width: d,
      height: d,
      borderRadius: d / 2,
      top: (size - d) / 2,
      left: (size - d) / 2,
      borderWidth: 1,
      borderColor,
    };
  };

  const labelSize = size * 0.36;
  const holeSize = size * 0.07;

  return (
    <Animated.View
      style={[
        styles.vinylDisc,
        { width: size, height: size, borderRadius: size / 2, transform: [{ rotate }] },
      ]}
    >
      <View style={ring(0.94, 'rgba(245,166,35,0.3)')} />
      <View style={ring(0.78, 'rgba(245,166,35,0.2)')} />
      <View style={ring(0.6, 'rgba(245,166,35,0.2)')} />
      <View style={ring(0.44, 'rgba(245,166,35,0.3)')} />
      <View
        style={[
          styles.vinylLabel,
          {
            width: labelSize,
            height: labelSize,
            borderRadius: labelSize / 2,
            top: (size - labelSize) / 2,
            left: (size - labelSize) / 2,
          },
        ]}
      >
        <Text style={styles.vinylLabelText}>SONU</Text>
      </View>
      <View
        style={[
          styles.vinylHole,
          {
            width: holeSize,
            height: holeSize,
            borderRadius: holeSize / 2,
            top: (size - holeSize) / 2,
            left: (size - holeSize) / 2,
          },
        ]}
      />
    </Animated.View>
  );
}

function SongRow({ item, index, onPlay }) {
  return (
    <View style={styles.songCard}>
      <View style={styles.trackBadge}>
        <Text style={styles.trackBadgeText}>{index + 1}</Text>
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songMeta} numberOfLines={1}>
          {item.artist} · {item.movie} ({item.year})
        </Text>
      </View>
      <Pressable
        onPress={() => onPlay(item)}
        style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
        hitSlop={8}
      >
        <Text style={styles.playIcon}>▶</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const playNext = () => {
    setNowPlaying((current) => {
      if (!current) return current;
      const i = SONGS.findIndex((s) => s.id === current.id);
      if (i === -1) return current;
      return SONGS[(i + 1) % SONGS.length];
    });
  };

  const shuffle = () => {
    setNowPlaying(SONGS[Math.floor(Math.random() * SONGS.length)]);
  };

  const current = nowPlaying || SONGS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={StyleSheet.absoluteFill}>
        <GlowOrbs />
        <FloatingParticles />
      </View>

      <View style={styles.topbar}>
        <TimePill />
        <LivePill />
      </View>

      <View style={styles.center}>
        <Text style={styles.brand}>SONU</Text>
        <Text style={styles.brandHindi}>सोनू सैलून रेडियो</Text>
        <Text style={styles.tagline}>Purane gaane, non-stop</Text>

        <BlurView intensity={40} tint="dark" style={styles.nowCard}>
          <Vinyl size={88} />
          <View style={styles.nowText}>
            <Text style={styles.nowLabel}>AB BAJ RAHA HAI</Text>
            <Text style={styles.nowTitle} numberOfLines={1}>
              {current.title}
            </Text>
            <Text style={styles.nowMeta} numberOfLines={1}>
              {current.artist} · {current.year}
            </Text>
          </View>
        </BlurView>

        <Pressable
          style={({ pressed }) => [styles.playBig, pressed && styles.playBigPressed]}
          onPress={() => setNowPlaying(current)}
        >
          <Text style={styles.playBigIcon}>▶</Text>
        </Pressable>

        <View style={styles.pillRow}>
          <Pressable style={styles.pillBtn} onPress={shuffle}>
            <Text style={styles.pillBtnText}>🔀 Shuffle</Text>
          </Pressable>
          <Pressable style={styles.pillBtn} onPress={() => setShowPlaylist(true)}>
            <Text style={styles.pillBtnText}>📜 Playlist</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footerCredit}>💈 Sonu Hair Salon — jahan katting aur gaana saath chalta hai</Text>

      <Modal
        visible={showPlaylist}
        animationType="slide"
        onRequestClose={() => setShowPlaylist(false)}
      >
        <SafeAreaView style={styles.playlistScreen}>
          <View style={styles.playlistBar}>
            <Text style={styles.playlistTitle}>Poora Playlist</Text>
            <Pressable
              onPress={() => setShowPlaylist(false)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          <FlatList
            data={SONGS}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SongRow
                item={item}
                index={index}
                onPlay={(song) => {
                  setNowPlaying(song);
                  setShowPlaylist(false);
                }}
              />
            )}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={!!nowPlaying}
        animationType="slide"
        onRequestClose={() => setNowPlaying(null)}
      >
        <SafeAreaView style={styles.playerScreen}>
          <View style={styles.playerBar}>
            <View style={styles.playerBarText}>
              <Text style={styles.playerTitle} numberOfLines={1}>
                {nowPlaying?.title}
              </Text>
              <Text style={styles.playerSubtitle} numberOfLines={1}>
                {nowPlaying?.artist} · {nowPlaying?.movie}
              </Text>
            </View>
            <Pressable
              onPress={() => setNowPlaying(null)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          {nowPlaying && (
            <Player videoId={nowPlaying.videoId} onEnded={playNext} style={styles.webview} />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    paddingTop: 10,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    color: COLORS.cream,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 4,
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
    marginTop: 4,
    marginBottom: 22,
  },
  nowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
    backgroundColor: COLORS.glass,
  },
  vinylDisc: {
    backgroundColor: '#120800',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(245,166,35,0.4)',
    overflow: 'hidden',
  },
  vinylLabel: {
    position: 'absolute',
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.ink,
  },
  vinylLabelText: {
    color: COLORS.ink,
    fontSize: 8,
    fontWeight: '800',
  },
  vinylHole: {
    position: 'absolute',
    backgroundColor: COLORS.cream,
  },
  nowText: {
    flex: 1,
    marginLeft: 14,
  },
  nowLabel: {
    color: COLORS.amber,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  nowTitle: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  nowMeta: {
    color: COLORS.fade,
    fontSize: 12,
    marginTop: 2,
  },
  playBig: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  playBigPressed: {
    opacity: 0.75,
  },
  playBigIcon: {
    color: COLORS.ink,
    fontSize: 28,
    marginLeft: 4,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  pillBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  pillBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  footerCredit: {
    textAlign: 'center',
    color: COLORS.fade,
    fontSize: 11,
    fontStyle: 'italic',
    paddingBottom: 14,
    paddingHorizontal: 24,
  },
  playlistScreen: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
  playlistBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.glassBorder,
  },
  playlistTitle: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  trackBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackBadgeText: {
    color: COLORS.cream,
    fontWeight: '700',
    fontSize: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  songMeta: {
    fontSize: 11,
    color: COLORS.fade,
    marginTop: 2,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  playButtonPressed: {
    opacity: 0.6,
  },
  playIcon: {
    color: COLORS.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 10,
  },
  playerScreen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  playerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.glassBorder,
  },
  playerBarText: {
    flex: 1,
  },
  playerTitle: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
  },
  playerSubtitle: {
    color: COLORS.fade,
    fontSize: 12,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeButtonText: {
    color: COLORS.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  webview: {
    flex: 1,
  },
});
