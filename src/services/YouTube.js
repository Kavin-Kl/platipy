import { youtubeClient } from './youtubeClient'

class YouTube {
  static async searchVideo(query) {
    try {
      const response = await youtubeClient.get('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          videoCategoryId: '10', // Music category
        },
      })

      const items = response.data?.items || []
      if (items.length > 0) {
        return items[0].id.videoId
      }
      return null
    } catch (error) {
      console.error('YouTube search error:', error)
      // Fallback: return null and we'll handle it gracefully
      return null
    }
  }
}

export default YouTube
