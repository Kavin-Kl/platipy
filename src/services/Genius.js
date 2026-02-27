import { genius } from './geniusClient'

class Genius {
  static async getSongs(query) {
    const res = await genius.get('/search', { params: { q: query } })
    const hits = res.data?.response?.hits ?? []

    return hits
      .filter((hit) => hit.type === 'song')
      .map((hit) => {
        const song = hit.result
        return {
          id: song.id,
          title: song.full_title || song.title,
          primaryArtist: song.primary_artist?.name,
          thumbnail: song.song_art_image_thumbnail_url,
        }
      })
  }
}

export default Genius

