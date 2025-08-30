// ===== Token bootstrap on playlists.html =====
function parseTokenFromHash() {
  if (!window.location.hash) return null;
  const hash = new URLSearchParams(window.location.hash.substring(1));
  const token = hash.get("access_token");
  const expiresIn = Number(hash.get("expires_in") || 3600);
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("token_expires_at", String(Date.now() + expiresIn * 1000));
    // clean up URL
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
    return token;
  }
  return null;
}
function ensureTokenOrBounce() {
  let token = localStorage.getItem("token");
  const exp = Number(localStorage.getItem("token_expires_at") || 0);
  if (!token || Date.now() >= exp) {
    // try hash (arriving from login)
    token = parseTokenFromHash();
  }
  if (!token || Date.now() >= Number(localStorage.getItem("token_expires_at") || 0)) {
    // back to login
    window.location.href = "index.html";
    return null;
  }
  return token;
}

const token = ensureTokenOrBounce();
if (!token) throw new Error("No token");

// ===== Fetch all playlists (with pagination) =====
async function fetchAllPlaylists() {
  const items = [];
  let url = "https://api.spotify.com/v1/me/playlists?limit=50";
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      if (res.status === 401) { localStorage.clear(); window.location.href = "index.html"; return []; }
      throw new Error("Failed to load playlists");
    }
    const data = await res.json();
    items.push(...(data.items || []));
    url = data.next;
  }
  return items;
}

// ===== Render grid =====
(async function init(){
  const container = document.getElementById("playlistContainer");
  container.innerHTML = "<p>Loading your playlists…</p>";
  try {
    const playlists = await fetchAllPlaylists();
    if (!playlists.length) {
      container.innerHTML = "<p>No playlists found.</p>";
      return;
    }
    container.innerHTML = "";
    playlists.forEach(p => {
      const el = document.createElement("div");
      el.className = "playlist-card";
      const img = (p.images && p.images[0] && p.images[0].url) ? p.images[0].url : "";
      el.innerHTML = `
        <img src="${img}" alt="">
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="meta">${p.tracks?.total ?? 0} songs</div>
        <div style="margin-top:10px;">
          <button class="secondary" style="background:#222;color:#fff;border:1px solid #333">Swipe</button>
        </div>
      `;
      el.querySelector("button").addEventListener("click", () => {
        localStorage.setItem("currentPlaylistId", p.id);
        localStorage.setItem("currentPlaylistName", p.name);
        window.location.href = "swipe.html";
      });
      container.appendChild(el);
    });
  } catch (e) {
    container.innerHTML = `<p>Could not load playlists.</p>`;
    console.error(e);
  }
})();

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
