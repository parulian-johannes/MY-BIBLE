// src/utils/helpers.js

import { Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Dimensi layar
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Format tanggal
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

// Format waktu
export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('id-ID', options);
};

// Fungsi untuk menyimpan data ke storage
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

// Fungsi untuk mengambil data dari storage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Fungsi untuk menghapus data dari storage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Fungsi untuk memeriksa platform
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Fungsi untuk memformat nomor ayat
export const formatVerseNumber = (number) => {
  return number < 10 ? `0${number}` : number.toString();
};

// Fungsi untuk memformat referensi ayat
export const formatVerseReference = (book, chapter, verse) => {
  return `${book} ${chapter}:${verse}`;
};

// Fungsi untuk menangani bookmark
export const toggleBookmark = async (verseId) => {
  try {
    const bookmarks = await getData(STORAGE_KEYS.BOOKMARKS) || [];
    const index = bookmarks.indexOf(verseId);
    
    if (index === -1) {
      bookmarks.push(verseId);
    } else {
      bookmarks.splice(index, 1);
    }
    
    await storeData(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return true;
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return false;
  }
};

// Fungsi untuk menangani highlight
export const toggleHighlight = async (verseId, color = '#FFEB3B') => {
  try {
    const highlights = await getData(STORAGE_KEYS.HIGHLIGHTS) || {};
    
    if (highlights[verseId]) {
      delete highlights[verseId];
    } else {
      highlights[verseId] = color;
    }
    
    await storeData(STORAGE_KEYS.HIGHLIGHTS, highlights);
    return true;
  } catch (error) {
    console.error('Error toggling highlight:', error);
    return false;
  }
};

// Fungsi untuk menyimpan catatan
export const saveNote = async (verseId, note) => {
  try {
    const notes = await getData(STORAGE_KEYS.NOTES) || {};
    notes[verseId] = {
      text: note,
      timestamp: new Date().toISOString(),
    };
    await storeData(STORAGE_KEYS.NOTES, notes);
    return true;
  } catch (error) {
    console.error('Error saving note:', error);
    return false;
  }
};

// Fungsi untuk tracking bacaan terakhir
export const trackRecentRead = async (reference) => {
  try {
    const recentReads = await getData(STORAGE_KEYS.RECENT_READS) || [];
    const newRecentReads = [
      reference,
      ...recentReads.filter(item => item !== reference),
    ].slice(0, 10); // Simpan 10 bacaan terakhir
    
    await storeData(STORAGE_KEYS.RECENT_READS, newRecentReads);
    return true;
  } catch (error) {
    console.error('Error tracking recent read:', error);
    return false;
  }
};

// Fungsi untuk memvalidasi email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fungsi untuk memformat teks
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Fungsi untuk mengacak array
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Fungsi untuk debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Fungsi untuk throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};