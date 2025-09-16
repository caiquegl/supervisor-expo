import axios from 'axios'

const apiBackoffice = axios.create({
  baseURL: 'https://api-black.rock-at.com/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiBackoffice
