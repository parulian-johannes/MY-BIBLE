import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Constants
const API_CONFIG = {
  HOST: 'catholic-bible.p.rapidapi.com',
  KEY: 'b6ed343513msh16d14dba53f28c2p1fe7b5jsn74ba981ee446',
};

// Fallback data
const fallbackBooks = [
  { id: '1', name: 'Genesis', testament: 'Old Testament' },
  { id: '2', name: 'Exodus', testament: 'Old Testament' },
  { id: '3', name: 'Leviticus', testament: 'Old Testament' },
  { id: '4', name: 'Numbers', testament: 'Old Testament' },
  { id: '5', name: 'Deuteronomy', testament: 'Old Testament' },
  { id: '40', name: 'Matthew', testament: 'New Testament' },
  { id: '41', name: 'Mark', testament: 'New Testament' },
  { id: '42', name: 'Luke', testament: 'New Testament' },
  { id: '43', name: 'John', testament: 'New Testament' },
  { id: '44', name: 'Acts', testament: 'New Testament' },
];

function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  const categories = ['All', 'Old Testament', 'New Testament'];

  useEffect(() => {
    loadBibleBooks();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out My Bible app - Your daily companion for Bible reading and study!',
        title: 'Share My Bible App',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the app');
    }
  };

  const loadBibleBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://${API_CONFIG.HOST}/bible/books`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_CONFIG.KEY,
          'X-RapidAPI-Host': API_CONFIG.HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedBooks = data
          .filter(book => book.book && book.id)
          .map(book => ({
            id: book.id.toString(),
            name: book.book,
            testament: parseInt(book.id) <= 46 ? 'Old Testament' : 'New Testament'
          }));

        if (formattedBooks.length > 0) {
          setBooks(formattedBooks);
          setFilteredBooks(formattedBooks);
        } else {
          setBooks(fallbackBooks);
          setFilteredBooks(fallbackBooks);
        }
      } else {
        setBooks(fallbackBooks);
        setFilteredBooks(fallbackBooks);
      }
    } catch (error) {
      console.error('Error loading Bible books:', error);
      setError(error.message);
      setBooks(fallbackBooks);
      setFilteredBooks(fallbackBooks);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = (query, category) => {
    let filtered = [...books];
    
    if (query) {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category !== 'All') {
      filtered = filtered.filter(book => book.testament === category);
    }
    
    setFilteredBooks(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterBooks(text, selectedCategory);
  };

  const handleClear = () => {
    setSearchQuery('');
    filterBooks('', selectedCategory);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterBooks(searchQuery, category);
  };

  const navigateToChapters = (book) => {
    navigation.navigate('ChapterScreen', {
      bookName: book.name,
      bookId: book.id,
      chapter: '1'
    });
  };

  const shareBook = async (book) => {
    try {
      await Share.share({
        message: `Check out ${book.name} from My Bible app! It's from the ${book.testament}.`,
        title: `Share ${book.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the book');
    }
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigateToChapters(item)}
      activeOpacity={0.7}
    >
      <View style={styles.bookContent}>
        <View style={styles.bookIcon}>
          <Ionicons name="bookmark-outline" size={24} color="#6366F1" />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookName}>{item.name}</Text>
          <Text style={styles.bookTestament}>{item.testament}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.bookShareButton}
        onPress={() => shareBook(item)}
      >
        <Ionicons name="share-social-outline" size={20} color="#6366F1" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyText}>No books found</Text>
      <Text style={styles.emptySubtext}>Try searching with a different term</Text>
    </View>
  );

  const renderNavbar = () => (
    <View style={styles.navbar}>
      <View style={styles.navbarInner}>
        <View style={styles.navbarContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.navbarTitle}>My Bible</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search book name..."
          placeholderTextColor="#9CA3AF"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        ) : null}
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
              selectedCategory === item && styles.categoryPillActive,
            ]}
            onPress={() => handleCategorySelect(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
        {renderNavbar()}
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading Bible books...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
        {renderNavbar()}
        <View style={[styles.container, styles.centerContent]}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load Bible books</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadBibleBooks}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderNavbar()}
      {renderSearchBar()}
      {renderCategories()}
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(book) => book.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          filteredBooks.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: '#1F2937',
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
  categoryPillActive: {
    backgroundColor: '#6366F1',
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
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookIcon: {
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookTestament: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookShareButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    marginLeft: 12,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pressableOpacity: {
    opacity: 0.7,
  },
  bookItemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
});

export default HomeScreen;