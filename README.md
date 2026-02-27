# Platipy - Spotify Clone with YouTube Integration

A fully-featured Spotify clone built with React, Firebase, and YouTube Data API.

## Features

- ✅ **User Authentication** - Email/Password and Google Sign-In
- ✅ **Song Search** - Search songs using Genius API
- ✅ **YouTube Playback** - Automatic YouTube search and embedded playback (hidden iframe)
- ✅ **Playlist Management** - Create and manage custom playlists
- ✅ **Liked Songs** - Like/Unlike songs with heart button
- ✅ **Library** - View all your playlists and liked songs
- ✅ **Responsive UI** - Beautiful Tailwind CSS design
- ✅ **Firebase Integration** - User data persisted to Firestore

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Update `.env.local` with:

```env
# Genius API (for song search)
VITE_GENIUS_ACCESS_TOKEN=your-genius-token

# YouTube Data API v3 (for playback)
VITE_YOUTUBE_API_KEY=your-youtube-api-key

# Firebase (for authentication & database)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Setup Services

Follow these guides in order:

1. **Firebase Setup** - See `FIREBASE_SETUP.md`
2. **YouTube API Setup** - See `YOUTUBE_API_SETUP.md`

### 4. Run the App

```bash
npm run dev
```

Visit: `https://localhost:5173`

## How YouTube Playback Works

1. Click any song in the app
2. App searches YouTube Data API for the song
3. Gets the video ID of the best match
4. Embeds the video in a hidden iframe (`opacity: 0`)
5. Audio plays automatically while the video remains invisible

## Documentation

- `FIREBASE_SETUP.md` - Complete Firebase configuration guide
- `YOUTUBE_API_SETUP.md` - YouTube Data API setup walkthrough (START HERE!)
- `SETUP.md` - General setup and features overview

## Troubleshooting

### Songs Not Playing
1. Get a YouTube API key - see `YOUTUBE_API_SETUP.md`
2. Add it to `.env.local` as `VITE_YOUTUBE_API_KEY`
3. Restart the dev server
4. Check browser console for errors

### Authentication Errors
1. Enable Email/Password and Google in Firebase Console
2. See `FIREBASE_SETUP.md` for detailed steps

## Technologies

- **React 19** - UI framework
- **Firebase** - Authentication & Database
- **YouTube Data API v3** - Video search & playback
- **Genius API** - Song metadata
- **Tailwind CSS** - Styling
- **Vite** - Build tool

---

Made with ❤️ using React, Firebase, and YouTube API
