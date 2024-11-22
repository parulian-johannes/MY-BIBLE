// src/config/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'new-american-standard-bible.p.rapidapi.com', // Sesuaikan dengan base URL API yang benar
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446', // Ganti dengan API key yang valid
  },
});

export default api;