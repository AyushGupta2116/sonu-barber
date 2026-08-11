export function buildYoutubePlayerHtml(videoId, autoplay) {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>html,body{margin:0;padding:0;background:#000;width:100%;height:100%;overflow:hidden;}#player{position:absolute;top:0;left:0;width:100%;height:100%;}</style>
</head>
<body>
<div id="player"></div>
<script>
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      videoId: '${videoId}',
      playerVars: { autoplay: ${autoplay ? 1 : 0}, playsinline: 1, rel: 0 },
      events: { onStateChange: onPlayerStateChange }
    });
  }
  window.__ytPlay = function () { player && player.playVideo && player.playVideo(); };
  window.__ytPause = function () { player && player.pauseVideo && player.pauseVideo(); };
  function onPlayerStateChange(event) {
    if (event.data === 0) {
      try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage('ENDED'); } catch (e) {}
      try { window.parent && window.parent.postMessage('ENDED', '*'); } catch (e) {}
    }
  }
</script>
</body>
</html>`;
}
