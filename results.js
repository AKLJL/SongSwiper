// ===== Ensure token =====
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

// ===== Load results from storage =====
const kept = JSON.parse(localStorage.getItem("keptTracks") || "[]");
const skipped = JSON.parse(localStorage.getItem("skippedTracks") || "[]");
const keptUris = JSON.parse(localStorage.getItem("keptUris") || "[]");

// ===== Render lists =====
const keptUl = document.getElementById("keptSongs");
const skippedUl = document.getElementById("skippedSongs");
function li(text){ const el=document.createElement("li"); el.className="results-item"; el.textContent=text; return el; }

function render(){
  keptUl.innerHTML = "";
  skippedUl.innerHTML = "";
  kept.forEach(t => keptUl.appendChild(li(`${t.name} — ${t.artists}`)));
  skipped.forEach(t => skippedUl.appendChild(li(`${t.name} — ${t.artists}`)));
}
render();

// ===== Create new playlist with kept songs =====
async function getMe(){
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers:{ Authorization:`Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}
async function createPlaylist(userId, name, description){
  const res = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
    method:"POST",
    headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
    body: JSON.stringify({
      name, description, public:false
    })
  });
  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}
async function addTracks(playlistId, uris){
  // Spotify allows up to 100 URIs per request
  let i = 0;
  while (i < uris.length){
    const chunk = uris.slice(i, i+100);
    const res = await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
      method:"POST",
      headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
      body: JSON.stringify({ uris: chunk })
    });
    if (!res.ok) throw new Error("Failed to add tracks");
    i += 100;
  }
}

document.getElementById("savePlaylistBtn").addEventListener("click", async ()=>{
  if (!keptUris.length){
    alert("No liked songs to add.");
    return;
  }
  try{
    const me = await getMe();
    const stamp = new Date().toISOString().split("T")[0];
    const name = `Song Swiper – ${stamp}`;
    const desc = "Created with Song Swiper";
    const pl = await createPlaylist(me.id, name, desc);
    await addTracks(pl.id, keptUris);
    alert("Added liked songs to your new playlist.");
    // Optional: open the playlist in a new tab
    window.open(`https://open.spotify.com/playlist/${pl.id}`, "_blank");
  }catch(e){
    console.error(e);
    alert("Could not add songs. Please ensure you granted modify playlist permissions and try again.");
  }
});
