/* app.js - Song Swiper (starter)
   - Demo mode works out of the box.
   - Connect buttons are hooked to auth starter functions (Spotify PKCE, Google OAuth, Apple MusicKit).
   - For production you will likely use serverless helpers described in README.
*/

const state = {
  provider: null,
  playlists: [],
  tracks: [],
  order: [],
  idx: 0,
  kept: [],
  passed: [],
  tokens: {} // store tokens in memory; can persist to localStorage if desired
};

// Elements
const redirectUriEl = document.getElementById('redirectUri');
redirectUriEl.textContent = location.origin + location.pathname;

const spotifyClientIdInput = document.getElementById('spotifyClientId');
const ytClientIdInput = document.getElementById('ytClientId');
const appleDevTokenInput = document.getElementById('appleDevToken');
const appleTokenEndpointInput = document.getElementById('appleTokenEndpoint');

const spotifyConnectBtn = document.getElementById('spotifyConnect');
const spotifyAutoBtn = document.getElementById('spotifyAuto');
const ytConnectBtn = document.getElementById('ytConnect');
const appleConnectBtn = document.getElementById('appleConnect');
const demoBtn = document.getElementById('demoBtn');

const playlistsCard = document.getElementById('playlistsCard');
const playlistGrid = document.getElementById('playlistGrid');
const providerBadge = document.getElementById('providerBadge');

const swiperCard = document.getElementById('swiperCard');
const stack = document.getElementById('stack');
const playlistTitle = document.getElementById('playlistTitle');
const progressText = document.getElementById('progressText');
const btnPass = document.getElementById('btnPass');
const btnLike = document.getElementById('btnLike');

const resultsCard = document.getElementById('resultsCard');
const keptList = document.getElementById('keptList');
const passedList = document.getElementById('passedList');
const saveNewBtn = document.getElementById('saveNew');
const saveExistBtn = document.getElementById('saveExist');

// Demo data (replace when integrating APIs)
const DEMO_PLAYLISTS = [
  { id: 'p1', name: 'Chill Vibes', image: 'https://via.placeholder.com/400x400/1DB954/ffffff?text=Chill', songs: [
      { id:'s1', title:'Blue Skies', artist:'Artist 1', image:'' },
      { id:'s2', title:'Late Night', artist:'Artist 2', image:'' },
      { id:'s3', title:'Soft Piano', artist:'Artist 3', image:'' }
    ]},
  { id: 'p2', name: 'Workout Hits', image: 'https://via.placeholder.com/400x400/1DB954/ffffff?text=Workout', songs: [
      { id:'s4', title:'Run Faster', artist:'Artist A' },
      { id:'s5', title:'Pump Up', artist:'Artist B' },
      { id:'s6', title:'All In', artist:'Artist C' }
    ]}
];

// Utility
function $(sel){ return document.querySelector(sel); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; }

// ---------- Demo flow ----------
demoBtn.onclick = () => {
  state.provider = 'demo';
  providerBadge.textContent = 'DEMO';
  state.playlists = DEMO_PLAYLISTS;
  renderPlaylists();
  playlistsCard.classList.remove('hidden');
};

function renderPlaylists(){
  playlistGrid.innerHTML = '';
  state.playlists.forEach(pl => {
    const el = document.createElement('div');
    el.className = 'playlist-card';
    el.innerHTML = `<img src="${pl.image}" alt="${pl.name}"><div style="padding:8px"><strong>${pl.name}</strong><div class="muted">${pl.songs.length} tracks</div></div>`;
    el.onclick = () => startSwiper(pl);
    playlistGrid.appendChild(el);
  });
}

async function startSwiper(pl){
  state.tracks = shuffle(pl.songs.slice());
  state.order = state.tracks.map((_,i)=>i);
  state.idx = 0; state.kept=[]; state.passed=[];
  playlistTitle.textContent = pl.name;
  progressText.textContent = `0 / ${state.tracks.length}`;
  playlistsCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  swiperCard.classList.remove('hidden');
  buildStack();
}

function buildStack(){
  stack.innerHTML = '';
  // add up to 40 cards (visual stack)
  const slice = state.tracks.slice(0, 40).reverse();
  slice.forEach((t, i) => {
    const c = document.createElement('div');
    c.className = 'swipe-card';
    c.style.zIndex = 100 + i;
    c.innerHTML = `
      <div class="card-inner" style="height:100%;display:flex;flex-direction:column">
        <div style="flex:1;background:#0f0f0f;display:flex;align-items:center;justify-content:center">
          ${t.image ? `<img src="${t.image}" style="max-width:100%; max-height:100%"/>` : `<div style="font-size:18px;color:#888">${t.artist}</div>`}
        </div>
        <div style="padding:12px">
          <div style="font-weight:700">${t.title}</div>
          <div class="muted" style="font-size:13px">${t.artist || ''}</div>
        </div>
      </div>
    `;
    enableSwipe(c, t);
    stack.appendChild(c);
  });
}

function enableSwipe(card, track){
  let startX=0, curX=0, dragging=false;
  const likeLabel = document.createElement('div'); likeLabel.className='swipe-label like'; likeLabel.textContent='ADD';
  const passLabel = document.createElement('div'); passLabel.className='swipe-label pass'; passLabel.textContent='PASS';
  card.appendChild(likeLabel); card.appendChild(passLabel);

  card.addEventListener('pointerdown', e => { dragging=true; startX=e.clientX; card.setPointerCapture(e.pointerId); });
  card.addEventListener('pointermove', e => { if(!dragging) return; curX=e.clientX; const dx=curX-startX; card.style.transform = `translateX(${dx}px) rotate(${dx/18}deg)`; likeLabel.style.opacity = dx>0?Math.min(dx/120,1):0; passLabel.style.opacity = dx<0?Math.min(-dx/120,1):0; });
  card.addEventListener('pointerup', e => { if(!dragging) return; dragging=false; const dx=(curX||e.clientX)-startX; if(dx>140){ doDecision(card, true, track); } else if(dx<-140){ doDecision(card, false, track); } else { card.style.transition='transform .18s'; card.style.transform=''; likeLabel.style.opacity=0; passLabel.style.opacity=0; setTimeout(()=>card.style.transition='',180); } });
}

function doDecision(card, keep, track){
  card.style.transition='transform .22s, opacity .22s';
  card.style.transform = `translateX(${keep?600:-600}px) rotate(${keep?14:-14}deg)`;
  card.style.opacity=0;
  setTimeout(()=> card.remove(), 230);
  if(keep) state.kept.push(track); else state.passed.push(track);
  state.idx++;
  progressText.textContent = `${state.idx} / ${state.tracks.length}`;
  if(state.idx >= state.tracks.length) setTimeout(showResults, 250);
}

btnLike.onclick = ()=> { // simulate like for top visible card
  const top = stack.querySelector('.swipe-card');
  if(top) { doDecision(top, true, state.tracks[state.idx]); }
};
btnPass.onclick = ()=> {
  const top = stack.querySelector('.swipe-card');
  if(top) { doDecision(top, false, state.tracks[state.idx]); }
};

function showResults(){
  swiperCard.classList.add('hidden');
  resultsCard.classList.remove('hidden');
  keptList.innerHTML = state.kept.map(t => `<li>${t.title} — ${t.artist||''}</li>`).join('');
  passedList.innerHTML = state.passed.map(t => `<li>${t.title} — ${t.artist||''}</li>`).join('');
}

// ----------- Basic auth hooks (starter) ------------
// NOTE: These functions are starter points. They will either:
//  - kickoff the client PKCE/redirect flow (Spotify), or
//  - redirect to Google OAuth consent (YouTube), or
//  - initialize MusicKit (Apple) if you provide a developer token.

spotifyConnect.onclick = async () => {
  const cid = spotifyClientIdInput.value.trim();
  if(!cid) return alert('Paste Spotify Client ID first');
  // PKCE flow: generate code_verifier & challenge, save verifier, redirect user
  const verifier = generateCodeVerifier();
  sessionStorage.setItem('sp_verifier', verifier);
  const challenge = await sha256base64url(verifier);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: cid,
    redirect_uri: location.origin + location.pathname,
    scope: 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private',
    code_challenge_method: 'S256',
    code_challenge: challenge
  });
  location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// If the user has returned to the page with ?code=... then call this to complete token exchange.
// NOTE: Many people hit a CORS error when calling the token endpoint from the browser. If you see that,
// use a serverless exchange endpoint (see README and provided server files).
spotifyAutoBtn.onclick = async () => {
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  if(!code) { alert('No code in URL'); return; }
  const clientId = spotifyClientIdInput.value.trim();
  if(!clientId) { alert('Paste your Spotify Client ID before finishing'); return; }
  const verifier = sessionStorage.getItem('sp_verifier');
  if(!verifier) { alert('Missing verifier. Start the Connect flow again.'); return; }
  // Try client-side exchange (may fail due to CORS)
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: location.origin + location.pathname,
      client_id: clientId,
      code_verifier: verifier
    });
    const resp = await fetch('https://accounts.spotify.com/api/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
    if(!resp.ok) throw new Error('Token exchange failed: ' + resp.status);
    const data = await resp.json();
    state.tokens.spotify = data;
    localStorage.setItem('ss_tokens', JSON.stringify(state.tokens));
    alert('Spotify connected (tokens saved locally)');
    // Clean URL
    history.replaceState({}, '', location.origin + location.pathname);
    // Optionally: fetch playlists using Spotify API with token
  } catch(err){
    console.error(err);
    alert('Client-side token exchange failed (CORS?). See README for serverless exchange option.');
  }
};

// YouTube Connect - opens OAuth consent in new window (example using OAuth implicit flow)
ytConnectBtn.onclick = () => {
  const cid = ytClientIdInput.value.trim();
  if(!cid) return alert('Paste Google OAuth Client ID first');
  // using the OAuth 2.0 endpoint (implicit for static sites)
  const params = new URLSearchParams({
    client_id: cid,
    redirect_uri: location.origin + location.pathname,
    response_type: 'token',
    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly',
    include_granted_scopes: 'true',
    prompt: 'consent'
  });
  location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Apple Music connect — if you pasted a Developer Token, initialize MusicKit
appleConnectBtn.onclick = async () => {
  const token = appleDevTokenInput.value.trim();
  const endpoint = appleTokenEndpointInput.value.trim();
  let devToken = token;
  if(!devToken && endpoint){
    // fetch dev token from your server endpoint
    try {
      const r = await fetch(endpoint);
      const j = await r.json();
      devToken = j.token || j.developerToken || '';
    } catch(e){ console.error(e); alert('Failed to fetch token from endpoint'); return; }
  }
  if(!devToken) return alert('Provide an Apple Developer Token or an endpoint that serves one.');
  // Load MusicKit script if not already loaded
  if(!window.MusicKit){
    const s = document.createElement('script');
    s.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js';
    s.onload = () => initMusicKit(devToken);
    document.head.appendChild(s);
  } else initMusicKit(devToken);
};

function initMusicKit(devToken){
  try {
    MusicKit.configure({ developerToken: devToken, app: { name:'Song Swiper', build:'1.0.0' }});
    const mk = MusicKit.getInstance();
    mk.authorize().then(token => {
      state.tokens.apple = { userToken: token, developerToken: devToken };
      localStorage.setItem('ss_tokens', JSON.stringify(state.tokens));
      alert('Apple Music connected (user token saved locally)');
    }).catch(e=>{ console.error(e); alert('Apple authorize failed'); });
  } catch(e){ console.error(e); alert('MusicKit init error'); }
}

// ------- small helpers for PKCE -------
function generateCodeVerifier(){ const arr = new Uint8Array(64); crypto.getRandomValues(arr); return Array.from(arr).map(n => ('0'+(n%36).toString(36)).slice(-1)).join(''); }
async function sha256base64url(str){
  const enc = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', enc);
  const b = btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return b;
}

// ---------- Save playlist actions (demo placeholders) ----------
saveNewBtn.onclick = () => {
  if(state.provider==='demo'){
    const name = prompt('New playlist name (demo)') || 'Song Swiper Picks';
    alert(`(Demo) New playlist "${name}" created locally. In a real integration this will call the provider API.`);
  } else {
    alert('Save-to-new for real providers is not implemented in demo. See README for API steps.');
  }
};
saveExistBtn.onclick = () => {
  alert('Save-to-existing is provider-specific. See README for steps to add tracks programmatically.');
};
