// ===== Spotify OAuth (Implicit Grant) =====
const CLIENT_ID = "2557a72b59e140fe98c86ec8e8ec5854";

// build a redirect to playlists.html that works on GitHub Pages
const REDIRECT_URI = `${window.location.origin}${(window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname.replace(/[^/]+$/, ''))}playlists.html`;

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-private"
].join(" ");

function goLogin() {
  const url =
    `${AUTH_ENDPOINT}?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=${encodeURIComponent(RESPONSE_TYPE)}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&show_dialog=false`;
  window.location.href = url;
}

// Attach to button on index.html
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) loginBtn.addEventListener("click", goLogin);

// Optional: if already authenticated, you can skip index -> playlists
(function maybeSkipLogin(){
  if (!loginBtn) return;
  const token = localStorage.getItem("token");
  const exp = Number(localStorage.getItem("token_expires_at") || 0);
  if (token && Date.now() < exp) {
    window.location.href = REDIRECT_URI;
  }
})();
