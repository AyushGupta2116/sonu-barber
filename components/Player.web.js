import { useEffect } from 'react';
import { buildYoutubePlayerHtml } from './ytPlayerHtml';

export default function Player({ videoId, onEnded, style }) {
  useEffect(() => {
    function handleMessage(event) {
      if (event.data === 'ENDED' && onEnded) onEnded();
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEnded]);

  return (
    <iframe
      key={videoId}
      srcDoc={buildYoutubePlayerHtml(videoId)}
      style={{ border: 0, ...style }}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
