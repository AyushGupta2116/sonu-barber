export default function SpotifyPlayer({ playlistId, style }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
      style={{ border: 0, borderRadius: 16, ...style }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
