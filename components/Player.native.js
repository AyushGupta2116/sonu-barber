import { WebView } from 'react-native-webview';
import { buildYoutubePlayerHtml } from './ytPlayerHtml';

export default function Player({ videoId, onEnded, style }) {
  return (
    <WebView
      key={videoId}
      originWhitelist={['*']}
      source={{ html: buildYoutubePlayerHtml(videoId) }}
      style={style}
      allowsFullscreenVideo
      javaScriptEnabled
      domStorageEnabled
      mediaPlaybackRequiresUserAction={false}
      onMessage={(event) => {
        if (event.nativeEvent.data === 'ENDED' && onEnded) onEnded();
      }}
    />
  );
}
