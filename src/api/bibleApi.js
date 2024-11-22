// src/api/bibleApi.js
import axios from 'axios';

// Konfigurasi API
const API_KEY = 'b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446'; // Ganti dengan API key Anda dari scripture.api.bible
const BASE_URL = 'new-american-standard-bible.p.rapidapi.com';

// Buat instance axios dengan konfigurasi default
const bibleApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api-key': API_KEY,
  },
});

// Get daftar Alkitab yang tersedia
export const getBibles = async () => {
  try {
    const response = await bibleApi.get('/bibles');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching bibles:', error);
    throw error;
  }
};

// Get daftar kitab dari Alkitab tertentu
export const getBooks = async (bibleId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/books`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Get daftar pasal dari kitab tertentu
export const getChapters = async (bibleId, bookId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/books/${bookId}/chapters`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

// Get isi dari sebuah pasal
export const getChapter = async (bibleId, chapterId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/chapters/${chapterId}`, {
      params: {
        'content-type': 'text',
        'include-notes': false,
        'include-titles': true,
        'include-chapter-numbers': true,
        'include-verse-numbers': true,
        'include-verse-spans': true,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

// Get ayat tertentu
export const getVerse = async (bibleId, verseId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/verses/${verseId}`, {
      params: {
        'content-type': 'text',
        'include-notes': false,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

// Mencari dalam Alkitab
export const searchBible = async (bibleId, query) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/search`, {
      params: {
        query,
        'limit': 50,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching bible:', error);
    throw error;
  }
};

// Get daftar ayat dari sebuah pasal
export const getVerses = async (bibleId, chapterId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching verses:', error);
    throw error;
  }
};

// Get audio dari sebuah pasal (jika tersedia)
export const getChapterAudio = async (bibleId, chapterId) => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/chapters/${chapterId}/audio`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapter audio:', error);
    throw error;
  }
};

// Untuk menyimpan API key dengan aman, buat file .env di root project
// Dan tambahkan:
// BIBLE_API_KEY=your_api_key_here

// Kemudian gunakan:
// import { BIBLE_API_KEY } from '@env';
// const API_KEY = BIBLE_API_KEY;

export default {
  getBibles,
  getBooks,
  getChapters,
  getChapter,
  getVerse,
  getVerses,
  searchBible,
  getChapterAudio,
};