export default function Player({ videoId, style }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`}
      style={{ border: 0, ...style }}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
