# Platipy - Spotify Clone Setup Guide

A fully-featured Spotify clone with authentication, playlist management, and YouTube integration.

## Features

- User authentication (Email/Password and Google Sign-In)
- Search songs using Genius API
- Play music via YouTube embed
- Create and manage playlists
- Like/Unlike songs
- Library view with all your playlists
- Responsive UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
   - Set up the following collections (they will be created automatically):
     - `playlists` - stores user playlists
     - `likedSongs` - stores liked songs for each user

5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (</>)
   - Copy the configuration values

### 3. Configure Environment Variables

Update the `.env.local` file with your Firebase credentials:

```env
VITE_GENIUS_ACCESS_TOKEN=your-genius-token-here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firestore Security Rules (Optional but Recommended)

Set up Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Playlists - users can only read/write their own playlists
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null &&
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                     request.auth.uid == request.resource.data.userId;
    }

    // Liked Songs - users can only read/write their own liked songs
    match /likedSongs/{likeId} {
      allow read, write: if request.auth != null &&
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                     request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `https://localhost:5173` (or another port if 5173 is in use).

## Usage

### First Time Setup

1. Navigate to the login page
2. Create an account using email/password or sign in with Google
3. You'll be redirected to the home page

### Features

#### Home View
- Browse "Made for you" and "Recently played" playlists
- View and play popular songs
- Like songs by clicking the heart icon

#### Search
- Click "Search" in the sidebar
- Enter a song name or artist
- Click on any result to play it via YouTube

#### Library
- Create new playlists by clicking "Create Playlist"
- View "Liked Songs" to see all your favorite tracks
- Manage your custom playlists

#### Playing Music
- Click any song to play it
- Music plays via embedded YouTube player (invisible)
- Use the player controls at the bottom to play/pause, skip, or go back

## Project Structure

```
platipy/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── PlayerBar.jsx
│   │   ├── PlaylistGrid.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SongTable.jsx
│   │   └── TopBar.jsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── services/          # API services
│   │   ├── Genius.js
│   │   └── geniusClient.js
│   ├── firebase.js        # Firebase configuration
│   ├── main.jsx           # App entry point
│   └── sampleData.js      # Sample data
├── .env.local             # Environment variables
└── package.json
```

## Technologies Used

- **React 19** - UI framework
- **React Router** - Routing
- **Firebase** - Authentication and database
- **Firestore** - NoSQL database for playlists and liked songs
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Genius API** - Song search
- **YouTube Embed** - Music playback

## Troubleshooting

### YouTube Player Not Working
- YouTube's embed player with `listType=search` may have limitations
- The app uses `youtube-nocookie.com` for better privacy
- Make sure autoplay is enabled in your browser

### Firebase Authentication Issues
- Ensure you've enabled the authentication methods in Firebase Console
- Check that your environment variables are correctly set
- For Google Sign-In, make sure to add your domain to authorized domains in Firebase

### Firestore Permission Denied
- Make sure you've set up the Firestore security rules
- Ensure the user is authenticated before accessing Firestore

## Future Enhancements

- Add ability to add songs to custom playlists
- Implement drag-and-drop for playlist song ordering
- Add playlist cover image upload
- Integrate with YouTube Data API for better search results
- Add volume control
- Implement shuffle and repeat modes
- Add song queue management
