import axios from 'axios'

export const genius = axios.create({
  baseURL: 'https://api.genius.com',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GENIUS_ACCESS_TOKEN}`,
  },
})

