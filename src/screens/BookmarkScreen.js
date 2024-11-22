import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BookmarkManager from '../utils/BookmarkManager';

const categories = [
  { id: 'all', name: 'Semua', color: '#6366F1' },
  { id: 'Penciptaan', name: 'Penciptaan', color: '#4CAF50' },
  { id: 'Kasih', name: 'Kasih', color: '#E91E63' },
  { id: 'Janji', name: 'Janji', color: '#FF9800' },
  { id: 'Pujian', name: 'Pujian', color: '#8B5CF6' }
];

const BookmarkScreen = ({ navigation, route }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const bookmarkListRef = useRef(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (route.params?.fromChapter) {
      loadBookmarks();
      
      // Set kategori filter jika ada
      if (route.params?.filterCategory) {
        setSelectedCategory(route.params.filterCategory);
      }
      
      // Scroll ke bookmark yang baru ditambahkan dengan delay
      if (route.params?.focusBookmarkId) {
        setTimeout(() => {
          scrollToBookmark(route.params.focusBookmarkId);
        }, 500);
      }
    }
  }, [route.params]);

  const scrollToBookmark = (bookmarkId) => {
    const index = bookmarks.findIndex(b => b.id === bookmarkId);
    if (index !== -1 && bookmarkListRef.current) {
      bookmarkListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0
      });
    }
  };

  const loadBookmarks = async () => {
    try {
      const loadedBookmarks = await BookmarkManager.getBookmarks();
      setBookmarks(loadedBookmarks.reverse());
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      Alert.alert('Error', 'Gagal memuat markah');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const handleDeleteBookmark = (bookmarkId) => {
    Alert.alert(
      'Hapus Markah',
      'Apakah Anda yakin ingin menghapus markah ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await BookmarkManager.deleteBookmark(bookmarkId);
              await loadBookmarks();
              Alert.alert('Berhasil', 'Markah telah dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus markah');
            }
          }
        }
      ]
    );
  };

  const handleOpenVerse = (bookmark) => {
    navigation.navigate('ChapterScreen', {
      bookId: bookmark.bookId,
      bookName: bookmark.book,
      chapter: bookmark.chapter,
      highlightVerses: bookmark.verses.map(v => v.number)
    });
  };

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return bookmarks.length;
    return bookmarks.filter(bookmark => bookmark.category === categoryId).length;
  };

  const filteredBookmarks = selectedCategory === 'all'
    ? bookmarks
    : bookmarks.filter(bookmark => bookmark.category === selectedCategory);

  const findCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (bookmarkListRef.current) {
        bookmarkListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0
        });
      }
    });
  };

  const renderNavbar = () => (
    <View style={styles.navbar}>
      <View style={styles.navbarInner}>
        <View style={styles.navbarContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="bookmark" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.navbarTitle}>Markah</Text>
        </View>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === item.id && {
                backgroundColor: item.color,
              },
            ]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive,
              ]}
            >
              {item.name} ({getCategoryCount(item.id)})
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyText}>Belum ada markah tersimpan</Text>
      <Text style={styles.emptySubtext}>Tambahkan markah saat membaca Alkitab</Text>
    </View>
  );

  const renderBookmarkItem = ({ item: bookmark }) => (
    <View
      style={[
        styles.bookmarkItem,
        { borderLeftColor: findCategoryColor(bookmark.category) }
      ]}
    >
      <View style={styles.bookmarkHeader}>
        <View style={styles.bookmarkInfo}>
          <Text style={styles.categoryLabel}>
            {categories.find(cat => cat.id === bookmark.category)?.name || bookmark.category}
          </Text>
          <Text style={styles.bookmarkReference}>
            {bookmark.book} {bookmark.chapter}:{bookmark.verses.map(v => v.number).join(', ')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteBookmark(bookmark.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text style={styles.verseText}>
        {bookmark.verses.map(verse => verse.text).join(' ')}
      </Text>

      <TouchableOpacity
        style={styles.openButton}
        onPress={() => handleOpenVerse(bookmark)}
      >
        <Ionicons name="book-outline" size={20} color="#6366F1" />
        <Text style={styles.openButtonText}>Buka Ayat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderNavbar()}
      {renderCategories()}
      <FlatList
        ref={bookmarkListRef}
        data={filteredBookmarks}
        renderItem={renderBookmarkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          filteredBookmarks.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  navbar: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
  },
  navbarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 8,
  },
  navbarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  bookmarkItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookmarkInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bookmarkReference: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 12,
  },
  verseText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  openButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default BookmarkScreen;