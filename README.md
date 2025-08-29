# Song Swiper

**Song Swiper** is a modern web app that lets you browse your Spotify playlists in a fun, Tinder-style swipe interface. Keep or pass songs to quickly curate your favorite tracks. Perfect for music lovers who want to discover and organize playlists in a playful way.

The site is fully frontend, works on GitHub Pages, and uses **Spotify login** — no backend required.

---

## 🌟 Features

1. **Spotify Login**

   * Users log in with their personal Spotify account.
   * OAuth token is obtained via frontend — no secrets are exposed.

2. **Playlist Grid**

   * After login, all your Spotify playlists are displayed in a responsive grid.
   * Playlist covers and names are shown.
   * Click a playlist to start swiping songs.

3. **Song Swiping**

   * Each song in the selected playlist appears one by one.
   * Swipe right (**👍 Keep**) → song added to your kept list.
   * Swipe left (**👎 Pass**) → song added to your passed list.
   * Songs are **not removed** from the original playlist.

4. **Shuffle Play**

   * Songs in the playlist are automatically shuffled before swiping.

5. **Results Page**

   * After all songs are swiped, you see a split list:

     * **Kept Songs** — songs you liked.
     * **Passed Songs** — songs you skipped.

6. **Modern Design**

   * Spotify-inspired colors:

     * Green: `#1DB954`
     * Dark: `#191414`
     * Accent: `#282828`
   * Card-style playlists and swipe buttons.

7. **Frontend Only**

   * Works entirely on GitHub Pages.
   * No backend needed.
   * Fully safe for public use.

---

## 📦 Files

| File          | Purpose                                                                             |
| ------------- | ----------------------------------------------------------------------------------- |
| `index.html`  | Main page structure, header, login, playlist grid, swipe interface, results section |
| `style.css`   | Styling for grid, cards, buttons, results, and Spotify colors                       |
| `app.js`      | Handles Spotify login, playlist fetch, shuffling, swiping, and results display      |
| `favicon.png` | Optional favicon for the site (your custom icon)                                    |

---

## ⚙️ Setup Instructions

1. **Create GitHub Repo**

   * Go to [GitHub](https://github.com) → New repository.
   * Name it e.g., `song-swiper`.
   * Choose **Public**.
   * Initialize with a `README.md`.

2. **Upload Files**

   * Upload `index.html`, `style.css`, `app.js`, and optional `favicon.png` to the repo root.

3. **Enable GitHub Pages**

   * Go to **Settings → Pages**.
   * Under **Branch**, select `main` → `/ (root)`.
   * Save. Your site will be live at:

     ```
     https://YOUR-USERNAME.github.io/song-swiper/
     ```

4. **Set Up Spotify Developer App**

   * Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   * Create a new app → copy the **Client ID**.
   * Set the **Redirect URI** to your GitHub Pages URL:

     ```
     https://YOUR-USERNAME.github.io/song-swiper/
     ```
   * Save.

5. **Configure `app.js`**

   * Replace the `CLIENT_ID` placeholder with your **Spotify Client ID**.

     ```javascript
     const CLIENT_ID = "YOUR_CLIENT_ID_HERE";
     ```

6. **Launch Site**

   * Open your GitHub Pages URL.
   * Click **Login with Spotify**.
   * Authorize the app.
   * Browse your playlists and start swiping songs.

---

## 💡 Notes

* **Public Use:** Each visitor logs in with their own Spotify account — no tokens are shared.
* **No Backend:** GitHub Pages is static, so all logic runs in the browser.
* **Spotify API Limits:** Standard Spotify Web API limits apply.
* **Future Expansion:** Apple Music and YouTube Music support can be added later with their respective APIs.

---

## 🖼 Screenshot (Optional)

*(Add a screenshot of the playlist grid or swipe view here)*

---

## ⚡ License

MIT License — feel free to fork, modify, and use.


