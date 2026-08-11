import { useEffect, useRef } from 'react';

let apiPromise = null;
function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve(window.YT);
    };
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
  return apiPromise;
}

export default function Player({ videoId, playing, onEnded }) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const readyRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId,
        playerVars: { autoplay: playing ? 1 : 0, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            readyRef.current = true;
          },
          onStateChange: (event) => {
            if (event.data === 0 && onEndedRef.current) onEndedRef.current();
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const p = playerRef.current;
    if (readyRef.current && p && p.loadVideoById && videoId) {
      p.loadVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!readyRef.current || !p) return;
    if (playing) {
      p.playVideo && p.playVideo();
    } else {
      p.pauseVideo && p.pauseVideo();
    }
  }, [playing, videoId]);

  return (
    <div
      ref={hostRef}
      style={{ width: 1, height: 1, position: 'absolute', opacity: 0, pointerEvents: 'none' }}
    />
  );
}
