import axios from 'axios'

export const genius = axios.create({
  baseURL: '/genius',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GENIUS_ACCESS_TOKEN}`,
  },
})

