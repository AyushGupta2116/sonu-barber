import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SONGS } from './data/songs';

const COLORS = {
  cream: '#F6ECD9',
  card: '#FFF8EA',
  maroon: '#8B1E1E',
  maroonDark: '#5E1414',
  gold: '#C9A227',
  ink: '#2B1B12',
  fade: '#8A7256',
  poleWhite: '#FFFFFF',
  poleBlue: '#1E3A8B',
};

function BarberPole() {
  const stripes = ['red', 'white', 'blue', 'white', 'red', 'white', 'blue', 'white', 'red'];
  return (
    <View style={styles.poleRow}>
      {stripes.map((c, i) => (
        <View
          key={i}
          style={[
            styles.poleStripe,
            c === 'red' && { backgroundColor: COLORS.maroon },
            c === 'white' && { backgroundColor: COLORS.poleWhite },
            c === 'blue' && { backgroundColor: COLORS.poleBlue },
          ]}
        />
      ))}
    </View>
  );
}

function SongRow({ item, index }) {
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
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <BarberPole />
        <Text style={styles.scissors}>✂️</Text>
        <Text style={styles.shopName}>SONU HAIR SALON</Text>
        <Text style={styles.tagline}>Katting · Shaving · Purane Gaane</Text>
        <BarberPole />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Aaj Ka Playlist</Text>
        <Text style={styles.listSubtitle}>{SONGS.length} purane gaane, ek se ek</Text>
      </View>

      <FlatList
        data={SONGS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <SongRow item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <Text style={styles.footerNote}>💈 Baal chhote, yaadein lambi. Phir milenge!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    backgroundColor: COLORS.maroonDark,
    paddingTop: 18,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: COLORS.gold,
  },
  poleRow: {
    flexDirection: 'row',
    width: '70%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 6,
  },
  poleStripe: {
    flex: 1,
  },
  scissors: {
    fontSize: 26,
    marginTop: 4,
  },
  shopName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.poleWhite,
    marginTop: 4,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ink,
  },
  listSubtitle: {
    fontSize: 13,
    color: COLORS.fade,
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
  },
  trackBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.maroon,
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
  separator: {
    height: 10,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    color: COLORS.fade,
    fontStyle: 'italic',
  },
});
