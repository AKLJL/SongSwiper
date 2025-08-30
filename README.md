
# 🎶 Song Swiper

**Song Swiper** is a modern, Spotify-inspired web app that lets you log in with Spotify, browse your playlists, and swipe through songs Tinder-style to keep or skip them.
It’s built entirely with **frontend code** (HTML/CSS/JS) and hosted on **GitHub Pages** — no backend required.

👉 Live Demo: [press me](https://akljl.github.io/song-swiper/index.html)

---

## 🌟 Features

### 🔐 Spotify Login

* Secure login with your personal Spotify account.
* Built with **Spotify OAuth** (implicit flow).
* No secrets exposed — every user logs in with their own account.

### 📂 Playlist Browser

* Displays all your Spotify playlists in a **clean grid**.
* Cover art + playlist name shown.
* Select a playlist to start swiping.

### 👆 Tinder-Style Swiping

* **Swipe Right (Keep 👍)** → Save track to “Kept Songs.”
* **Swipe Left (Skip 👎)** → Add track to “Passed Songs.”
* Original playlists remain unchanged.
* Tracks are **shuffled** automatically.

### 📊 Results Page

* Split results after swiping:

  * ✅ **Kept Songs** list.
  * ❌ **Skipped Songs** list.
* **Add to Playlist**: create a new playlist with your Kept Songs directly in your Spotify account.

### ⚙️ Settings Page

* Manage your session (log out, re-login).
* External links (squiggle under header) to  socials:

  * [YouTube](https://www.youtube.com/@AKLJL64)
  * [X (Twitter)](https://x.com/AKLJL64)

### 🎨 Modern Spotify-Inspired UI

* Brand colors:

  * Green → `#1DB954`
  * Dark → `#191414`
  * Accent → `#282828`
* Clean typography and spacing.
* Responsive design for both desktop and mobile.

---

## 📂 Project Structure

song-swiper/
│
├── index.html         # Login page
├── playlists.html     # Playlist selection page
├── swipe.html         # Song swiping interface
├── results.html       # Kept vs skipped songs
├── settings.html      # Settings / logout page
├──style.css      # Shared styling
├── auth.js        # Spotify login + token storage
├── playlists.js   # Fetch & display playlists
├── swipe.js       # Handle swipe logic
├── results.js     # Show results + add playlist
└── favicon.ico    # Favicon
│
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone / Fork Repo

```bash
git clone https://github.com/akljl/song-swiper.git
cd song-swiper
```

### 2. Configure Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Create an app → copy the **Client ID**.
3. Set **Redirect URIs** to your GitHub Pages URL:

   ```
   https://akljl.github.io/song-swiper/
   ```

   *(and each page, if needed: `/index.html`, `/playlists.html`, etc.)*
4. Save.

### 3. Insert Client ID

In `app.js`, update:

```js
const CLIENT_ID = "2557a72b59e140fe98c86ec8e8ec5854";
```

### 4. Deploy

1. Commit changes and push to GitHub.
2. Enable **GitHub Pages** in repo → Settings → Pages → select `main` branch root.
3. Access your site at:

   ```
   https://akljl.github.io/song-swiper/
   ```

---

## 🚀 Future Ideas

* Save swipe progress between sessions.
* Smarter shuffle (by genre, release year, popularity).
* Animated swipe cards for more fluid UX.
* Friend mode: compare swipes with friends.

---

## ⚡ License

MIT License — free to fork, modify, and share.


