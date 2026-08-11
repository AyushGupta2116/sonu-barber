import { LinearGradient } from 'expo-linear-gradient';
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
import Player from './components/Player';
import { SONGS } from './data/songs';

const COLORS = {
  teal: '#2E8B82',
  tealDark: '#1D5850',
  tealDeep: '#123B36',
  mustard: '#DDA53D',
  mustardDark: '#B9832A',
  signBorder: '#3A2A12',
  signRed: '#7E2020',
  signGreen: '#2F5233',
  cream: '#F1EAD9',
  card: '#FBF6E9',
  maroon: '#8B1E1E',
  maroonDark: '#5E1414',
  gold: '#C9A227',
  ink: '#2B2013',
  fade: '#5C6B63',
  poleWhite: '#FFFFFF',
  poleBlue: '#1E3A8B',
};

function Vinyl({ size = 120 }) {
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

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate }],
        },
      ]}
    >
      <View style={ring(0.94, 'rgba(201,162,39,0.28)')} />
      <View style={ring(0.78, 'rgba(201,162,39,0.18)')} />
      <View style={ring(0.6, 'rgba(201,162,39,0.18)')} />
      <View style={ring(0.44, 'rgba(201,162,39,0.28)')} />
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
      <View style={[styles.vinylShine, { pointerEvents: 'none' }]} />
    </Animated.View>
  );
}

function SongRow({ item, index, onPlay }) {
  const handlePlay = () => onPlay(item);

  return (
    <View style={styles.songCard}>
      <View style={styles.trackBadge}>
        <Text style={styles.trackBadgeText}>{index + 1}</Text>
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songMeta}>
          {item.artist} · {item.movie} ({item.year})
        </Text>
      </View>
      <Pressable
        onPress={handlePlay}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.shopFront}>
        <View style={styles.signBoard}>
          <LinearGradient
            colors={[COLORS.mustard, COLORS.mustardDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.signBoardInner}
          >
            <Text style={styles.signSonu}>Sonu</Text>
            <Text style={styles.signMain}>HAIR CUTTING SALOON</Text>
            <Text style={styles.signHindi}>सोनू केश कर्तनालय</Text>
          </LinearGradient>
        </View>

        <View style={styles.shutterGrille}>
          {Array.from({ length: 14 }).map((_, i) => (
            <View key={i} style={styles.shutterBar} />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.hero, pressed && styles.heroPressed]}
          onPress={() => setNowPlaying(SONGS[0])}
        >
          <Vinyl size={88} />
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>NOW SPINNING</Text>
            <Text style={styles.heroSong} numberOfLines={1}>
              {SONGS[0].title}
            </Text>
            <Text style={styles.heroMeta}>
              {SONGS[0].artist} · {SONGS[0].year}
            </Text>
            <Text style={styles.heroJoke}>Tap to play ▶</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Aaj Ka Playlist</Text>
        <Text style={styles.listSubtitle}>{SONGS.length} purane gaane, ek se ek</Text>
      </View>

      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SongRow item={item} index={index} onPlay={setNowPlaying} />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <Text style={styles.footerNote}>💈 Baal chhote, yaadein lambi. Phir milenge!</Text>
        }
      />

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
          {nowPlaying && <Player videoId={nowPlaying.videoId} style={styles.webview} />}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.tealDeep,
  },
  shopFront: {
    backgroundColor: COLORS.teal,
    paddingTop: 16,
    paddingBottom: 18,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: COLORS.tealDark,
  },
  signBoard: {
    width: '90%',
    borderWidth: 3,
    borderColor: COLORS.signBorder,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  signBoardInner: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  signSonu: {
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: COLORS.cream,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  signMain: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.signRed,
    letterSpacing: 1.5,
    marginTop: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.25)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0,
  },
  signHindi: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.signGreen,
    marginTop: 4,
  },
  shutterGrille: {
    flexDirection: 'row',
    width: '90%',
    height: 8,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  shutterBar: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  vinylDisc: {
    backgroundColor: '#1B1108',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(201,162,39,0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  vinylShine: {
    position: 'absolute',
    width: '45%',
    height: '140%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    transform: [{ rotate: '25deg' }],
    left: '8%',
  },
  vinylLabel: {
    position: 'absolute',
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.maroonDark,
  },
  vinylLabelText: {
    color: COLORS.maroonDark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vinylHole: {
    position: 'absolute',
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 12,
    width: '88%',
    borderWidth: 1,
    borderColor: 'rgba(221,165,61,0.45)',
  },
  heroPressed: {
    opacity: 0.75,
  },
  heroText: {
    flex: 1,
    marginLeft: 14,
  },
  heroLabel: {
    color: COLORS.mustard,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroSong: {
    color: COLORS.poleWhite,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  heroMeta: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 1,
  },
  heroJoke: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
  },
  listSubtitle: {
    fontSize: 13,
    color: 'rgba(241,234,217,0.65)',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADFC4',
    shadowColor: '#4A2E10',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  trackBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackBadgeText: {
    color: COLORS.poleWhite,
    fontWeight: '700',
    fontSize: 13,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
  },
  songMeta: {
    fontSize: 12,
    color: COLORS.fade,
    marginTop: 2,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  playButtonPressed: {
    opacity: 0.6,
  },
  playIcon: {
    color: COLORS.signBorder,
    fontSize: 13,
    fontWeight: '700',
  },
  separator: {
    height: 10,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    color: 'rgba(241,234,217,0.6)',
    fontStyle: 'italic',
  },
  playerScreen: {
    flex: 1,
    backgroundColor: COLORS.tealDeep,
  },
  playerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.tealDark,
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
    color: 'rgba(241,234,217,0.7)',
    fontSize: 12,
    marginTop: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeButtonText: {
    color: COLORS.signBorder,
    fontSize: 15,
    fontWeight: '800',
  },
  webview: {
    flex: 1,
  },
});
