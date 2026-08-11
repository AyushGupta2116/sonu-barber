import { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { buildYoutubePlayerHtml } from './ytPlayerHtml';

export default function Player({ videoId, playing, onEnded }) {
  const webviewRef = useRef(null);

  useEffect(() => {
    if (!webviewRef.current) return;
    const js = playing
      ? 'window.__ytPlay && window.__ytPlay(); true;'
      : 'window.__ytPause && window.__ytPause(); true;';
    webviewRef.current.injectJavaScript(js);
  }, [playing]);

  return (
    <WebView
      key={videoId}
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: buildYoutubePlayerHtml(videoId, playing) }}
      style={styles.hidden}
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

const styles = {
  hidden: { width: 1, height: 1, position: 'absolute', opacity: 0 },
};
