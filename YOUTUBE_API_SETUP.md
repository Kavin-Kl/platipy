# YouTube Data API v3 Setup Guide

To enable automatic YouTube playback in your Spotify clone, you need to get a YouTube Data API key.

## Steps to Get YouTube API Key

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create a New Project (or use existing)
1. Click on the project dropdown at the top
2. Click "New Project"
3. Name it: "Platipy" or any name you prefer
4. Click "Create"

### 3. Enable YouTube Data API v3
1. Go to: https://console.cloud.google.com/apis/library
2. Search for "YouTube Data API v3"
3. Click on it
4. Click "Enable"

### 4. Create API Credentials
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" at the top
3. Select "API Key"
4. Copy the API key that appears

### 5. (Optional but Recommended) Restrict the API Key
For security, restrict your API key:

1. Click on the API key you just created
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `localhost/*` and `https://localhost/*`
3. Under "API restrictions":
   - Select "Restrict key"
   - Check only "YouTube Data API v3"
4. Click "Save"

### 6. Add API Key to Your Project

Update your `.env.local` file:

```env
VITE_YOUTUBE_API_KEY=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with the actual API key you copied.

### 7. Restart Your Dev Server

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## How It Works Now

1. **Click any song** - The app will search YouTube for that song
2. **Gets video ID** - Uses YouTube Data API to find the best match
3. **Plays in hidden iframe** - The video plays with `opacity: 0` (invisible)
4. **Audio plays** - You hear the music without seeing the video

## API Quota Information

YouTube Data API v3 has a **free quota of 10,000 units per day**.

- Each search costs **100 units**
- This means you can search **100 songs per day** for free
- Quota resets daily at midnight Pacific Time (PT)

If you need more quota:
- You can request a quota increase from Google
- Or implement caching to reduce API calls

## Fallback Behavior

If the YouTube API:
- Is not configured
- Returns an error
- Reaches quota limit

The app will automatically:
- Open YouTube search in a new tab
- User can manually select and play the song

## Testing

1. Add your API key to `.env.local`
2. Restart the dev server
3. Log into the app
4. Click any song
5. You should see "Loading song..." briefly
6. Then the song should start playing (audio only, invisible video)

## Troubleshooting

### "API key not valid" error
- Make sure you enabled YouTube Data API v3
- Check that your API key is correct in `.env.local`
- If you set restrictions, make sure `localhost` is allowed

### "Quota exceeded" error
- You've used all 10,000 units for today
- Wait until quota resets (midnight PT)
- Or request quota increase from Google

### Songs not playing
- Check browser console for errors
- Make sure autoplay is enabled in browser settings
- Try a different browser
- Check if YouTube is blocked by your network/firewall

### No sound
- Check that your browser allows autoplay with sound
- Some browsers require user interaction first
- Try clicking the play/pause button once

## Advanced: Increase Quota

If you need more than 100 searches per day:

1. Go to: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
2. Click on "Queries per day"
3. Click "Apply for higher quota"
4. Fill out the form explaining your use case
5. Google will review and may increase your quota

## Cost

The YouTube Data API v3 is **FREE** up to 10,000 units/day. There is no paid tier - if you need more, you must request a quota increase from Google.
