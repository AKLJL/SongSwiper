const CLIENT_ID = "2557a72b59e140fe98c86ec8e8ec5854";
const REDIRECT_URI = "https://akljl.github.io/song-swiper/index.html";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

document.getElementById("login-btn").addEventListener("click", () => {
  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=playlist-read-private%20playlist-read-collaborative%20user-read-private`;
  window.location = authUrl;
});

// Save token from URL after redirect
window.onload = () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("spotify_token", token);
      window.location.href = "playlists.html";
    }
  }
};
