// ===== CONFIG =====
const CLIENT_ID = "2557a72b59e140fe98c86ec8e8ec5854";
const REDIRECT_URI = window.location.origin;
const SCOPES = "playlist-read-private playlist-modify-private playlist-modify-public";

// ===== STATE =====
let accessToken = null;
let playlists = [];
let currentSongs = [];
let currentIndex = 0;
let keptSongs = [];
let passedSongs = [];

// ===== DOM ELEMENTS =====
const loginBtn = document.getElementById("loginBtn");
const loginSection = document.getElementById("loginSection");
const playlistGrid = document.getElementById("playlistGrid");
const swipeSection = document.getElementById("swipeSection");
const songCard = document.getElementById("songCard");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const swipeLeftBtn = document.getElementById("swipeLeft");
const swipeRightBtn = document.getElementById("swipeRight");
const resultsDiv = document.getElementById("results");
const keptSongsList = document.getElementById("keptSongs");
const passedSongsList = document.getElementById("passedSongs");

// ===== LOGIN =====
loginBtn.addEventListener("click", () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
  window.location = url;
});

// ===== CHECK TOKEN =====
window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    accessToken = params.get("access_token");
    if (accessToken) {
      loginSection.style.display = "none";
      fetchPlaylists();
    }
  }
});

// ===== FETCH PLAYLISTS =====
async function fetchPlaylists() {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  playlists = data.items;
  displayPlaylists();
}

function displayPlaylists() {
  playlistGrid.innerHTML = "";
  playlists.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<img src="${p.images[0]?.url || ''}" width="100%"><p>${p.name}</p>`;
    div.addEventListener("click", () => startSwiper(p.id));
    playlistGrid.appendChild(div);
    div.style.display = "block";
  });
}

// ===== SWIPER =====
async function startSwiper(playlistId) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  currentSongs = data.items.map(i => i.track).sort(() => Math.random() - 0.5);
  currentIndex = 0;
  keptSongs = [];
  passedSongs = [];

  playlistGrid.style.display = "none";
  swipeSection.style.display = "block";
  showSong();
}

function showSong() {
  if (currentIndex >= currentSongs.length) {
    showResults();
    return;
  }
  const song = currentSongs[currentIndex];
  songTitle.textContent = song.name;
  songArtist.textContent = song.artists.map(a => a.name).join(", ");
}

swipeLeftBtn.addEventListener("click", () => {
  passedSongs.push(currentSongs[currentIndex]);
  currentIndex++;
  showSong();
});

swipeRightBtn.addEventListener("click", () => {
  keptSongs.push(currentSongs[currentIndex]);
  currentIndex++;
  showSong();
});

// ===== RESULTS =====
function showResults() {
  swipeSection.style.display = "none";
  resultsDiv.style.display = "block";

  keptSongsList.innerHTML = "";
  passedSongsList.innerHTML = "";

  keptSongs.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — ${s.artists.map(a => a.name).join(", ")}`;
    keptSongsList.appendChild(li);
  });

  passedSongs.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — ${s.artists.map(a => a.name).join(", ")}`;
    passedSongsList.appendChild(li);
  });
}
