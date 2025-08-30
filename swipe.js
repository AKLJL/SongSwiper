// ===== Ensure token & selected playlist =====
function ensureToken() {
  const token = localStorage.getItem("token");
  const exp = Number(localStorage.getItem("token_expires_at") || 0);
  if (!token || Date.now() >= exp) {
    window.location.href = "index.html";
    return null;
  }
  return token;
}
const token = ensureToken();
if (!token) throw new Error("No token");

const playlistId = localStorage.getItem("currentPlaylistId");
const playlistName = localStorage.getItem("currentPlaylistName") || "Playlist";
if (!playlistId) {
  window.location.href = "playlists.html";
  throw new Error("No playlist selected");
}

// ===== State =====
let tracks = [];
let idx = 0;
let kept = JSON.parse(localStorage.getItem("keptTracks") || "[]");
let skipped = JSON.parse(localStorage.getItem("skippedTracks") || "[]");

// ===== Fetch all tracks in playlist =====
async function fetchAllTracks(playlistId){
  const out = [];
  let url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks?limit=100`;
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      if (res.status === 401) { localStorage.clear(); window.location.href = "index.html"; return []; }
      throw new Error("Failed to load tracks");
    }
    const data = await res.json();
    for (const it of data.items || []) {
      const t = it.track;
      if (!t || t.is_local) continue; // skip local/unavailable
      out.push({
        uri: t.uri,
        name: t.name,
        artists: (t.artists || []).map(a=>a.name).join(", "),
        albumArt: (t.album && t.album.images && t.album.images[0]) ? t.album.images[0].url : "",
      });
    }
    url = data.next;
  }
  return out;
}

// ===== Shuffle (Fisher–Yates) =====
function shuffle(a){
  for (let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== UI refs =====
const card = document.getElementById("songCard");
const art = document.getElementById("albumArt");
const titleEl = document.getElementById("songTitle");
const artistEl = document.getElementById("songArtist");
const keepBtn = document.getElementById("keepBtn");
const skipBtn = document.getElementById("skipBtn");

// ===== Init =====
(async function init(){
  card.querySelector("h2")?.remove; // noop, just in case
  titleEl.textContent = "Loading…";
  artistEl.textContent = "";
  try{
    tracks = await fetchAllTracks(playlistId);
    if (!tracks.length){
      titleEl.textContent = "No playable tracks";
      artistEl.textContent = "";
      return;
    }
    shuffle(tracks);
    idx = 0;
    render();
  }catch(e){
    console.error(e);
    titleEl.textContent = "Failed to load songs";
    artistEl.textContent = "";
  }
})();

function render(){
  const t = tracks[idx];
  if (!t){
    // Done → go to results
    localStorage.setItem("keptTracks", JSON.stringify(kept));
    localStorage.setItem("skippedTracks", JSON.stringify(skipped));
    localStorage.setItem("keptUris", JSON.stringify(kept.map(x=>x.uri)));
    window.location.href = "results.html";
    return;
  }
  art.src = t.albumArt || "";
  art.alt = t.name;
  titleEl.textContent = t.name;
  artistEl.textContent = t.artists;
}

// ===== Actions =====
keepBtn.addEventListener("click", () => {
  if (!tracks[idx]) return;
  kept.push(tracks[idx]);
  idx++;
  render();
});

skipBtn.addEventListener("click", () => {
  if (!tracks[idx]) return;
  skipped.push(tracks[idx]);
  idx++;
  render();
});

// Optional: keyboard shortcuts (← skip, → keep)
document.addEventListener("keydown", (e)=>{
  if (e.key === "ArrowLeft") skipBtn.click();
  if (e.key === "ArrowRight") keepBtn.click();
});
