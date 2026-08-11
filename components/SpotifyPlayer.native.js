import { WebView } from 'react-native-webview';

export default function SpotifyPlayer({ playlistId, style }) {
  return (
    <WebView
      source={{ uri: `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0` }}
      style={style}
      allowsFullscreenVideo
      javaScriptEnabled
      domStorageEnabled
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      thirdPartyCookiesEnabled
      sharedCookiesEnabled
    />
  );
}
