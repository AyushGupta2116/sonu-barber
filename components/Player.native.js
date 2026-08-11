import { WebView } from 'react-native-webview';

export default function Player({ videoId, style }) {
  return (
    <WebView
      source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1` }}
      style={style}
      allowsFullscreenVideo
      javaScriptEnabled
      mediaPlaybackRequiresUserAction={false}
    />
  );
}
