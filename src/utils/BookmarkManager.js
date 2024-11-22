import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@bible_bookmarks';

class BookmarkManager {
  static async getBookmarks() {
    try {
      const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (!bookmarksJson) return [];
      
      const bookmarks = JSON.parse(bookmarksJson);
      return Array.isArray(bookmarks) ? bookmarks : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      throw new Error('Gagal mengambil data markah');
    }
  }

  static async addBookmark(newBookmark) {
    try {
      if (!newBookmark.book || !newBookmark.chapter || !Array.isArray(newBookmark.verses)) {
        throw new Error('Data markah tidak lengkap');
      }

      if (newBookmark.verses.length === 0) {
        throw new Error('Tidak ada ayat yang dipilih');
      }

      const bookmarks = await this.getBookmarks();

      // Check for duplicates
      const isDuplicate = bookmarks.some(bookmark => 
        bookmark.book === newBookmark.book &&
        bookmark.chapter === newBookmark.chapter &&
        JSON.stringify(bookmark.verses.map(v => v.number).sort()) === 
        JSON.stringify(newBookmark.verses.map(v => v.number).sort())
      );

      if (isDuplicate) {
        throw new Error('Ayat ini sudah ditandai');
      }

      const bookmarkToSave = {
        ...newBookmark,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const updatedBookmarks = [bookmarkToSave, ...bookmarks];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));

      return bookmarkToSave;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  static async deleteBookmark(bookmarkId) {
    try {
      const bookmarks = await this.getBookmarks();
      const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));
      return true;
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }

  static async clearAllBookmarks() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }

  static async getBookmarksByCategory(category) {
    try {
      const bookmarks = await this.getBookmarks();
      return category === 'all' 
        ? bookmarks 
        : bookmarks.filter(bookmark => bookmark.category === category);
    } catch (error) {
      console.error('Error getting bookmarks by category:', error);
      return [];
    }
  }

  static async checkVerseBookmarked(bookName, chapter, verseNumber) {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.some(bookmark => 
        bookmark.book === bookName &&
        bookmark.chapter === Number(chapter) &&
        bookmark.verses.some(verse => verse.number === verseNumber)
      );
    } catch (error) {
      console.error('Error checking verse bookmark status:', error);
      return false;
    }
  }

  static async updateBookmark(bookmarkId, updatedData) {
    try {
      const bookmarks = await this.getBookmarks();
      const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmarkId);

      if (bookmarkIndex === -1) {
        throw new Error('Markah tidak ditemukan');
      }

      bookmarks[bookmarkIndex] = {
        ...bookmarks[bookmarkIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      return bookmarks[bookmarkIndex];
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  }
}

export default BookmarkManager;