# 🎵 Song Swiper

Song Swiper is a modern, swipe-based music discovery web app.  
Think **Tinder meets Spotify playlists** — pick a playlist, swipe right to save the songs you like, swipe left to skip the ones you don’t, and get a neat split list of your choices at the end.  

Built with **vanilla HTML, CSS, and JavaScript**, optimized for **GitHub Pages deployment**, and themed with Spotify-inspired colors.

---

## ✨ Features

### 🎨 Interface
- Clean, modern design inspired by Spotify’s dark theme (`#191414` + `#1DB954`).
- Mobile-first responsive layout.
- Playlist cards displayed in a **grid** with cover art & names.

### 🔑 Authentication
- Select your music service (Spotify, Apple Music, YouTube Music).
- [Planned] OAuth login flow for Spotify, Apple, and Google accounts.
- [Demo] Dummy playlists are included for testing without logins.

### 📂 Playlist Management
- Fetches user playlists from chosen music service (Spotify API, MusicKit JS for Apple, YouTube Data API for Google).
- Displays playlists in a grid with cover art & names.
- Supports **playlist selection** and **song shuffling**.

### 🎶 Song Swiping
- Each song is shown one by one.
- Swipe (or click buttons) to:
  - **👍 Keep** → add to your saved list.
  - **👎 Pass** → skip the song.
- [Planned] Gesture swiping on mobile (drag left/right).

### 📝 Results View
- After playlist ends, a **split view** shows:
  - ✅ Songs you kept.
  - ❌ Songs you passed.
- Option to create a **new playlist** or add to an **existing playlist** on your music service (future feature).

### ⚡ Demo Mode (No Login Required)
- Dummy playlists included in `app.js`:
  - Sample covers.
  - Random shuffled songs.
- Lets you experience full swipe flow offline.

### 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Spotify-inspired theme), Vanilla JS.
- **Hosting:** GitHub Pages.
- **APIs (future):**
  - Spotify Web API.
  - Apple MusicKit JS.
  - YouTube Data API v3.

---

## 🚀 Setup Guide

### 1. Clone the Repo
```bash
git clone https://github.com/AKLJL/SongSwiper.git
cd song-swiper
