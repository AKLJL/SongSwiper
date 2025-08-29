const CLIENT_ID = "2557a72b59e140fe98c86ec8e8ec5854";
const REDIRECT_URI = "https://akljl.github.io/song-swiper/playlists.html";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

document.getElementById("login-btn").onclick = () => {
  window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify`;
};
