import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookmarkManager from '../utils/BookmarkManager';

const categories = [
  { id: 'Penciptaan', name: 'Penciptaan', color: '#4CAF50' },
  { id: 'Kasih', name: 'Kasih', color: '#E91E63' },
  { id: 'Janji', name: 'Janji', color: '#FF9800' },
  { id: 'Pujian', name: 'Pujian', color: '#9C27B0' }
];

const verseCounts = {
  'Genesis': 50,
  'Exodus': 40,
  'Leviticus': 27,
  'Numbers': 36,
  'Deuteronomy': 34,
  'Matthew': 28,
  'Mark': 16,
  'Luke': 24,
  'John': 21,
  'Acts': 28,
  'Romans': 16,
  'Revelation': 22
};

const defaultVerses = {
  'John': {
    3: [
      { number: "16", text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal." },
      { number: "17", text: "Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk menghakimi dunia, melainkan untuk menyelamatkannya oleh Dia." }
    ]
  },
  'Genesis': {
    1: [
      { number: "1", text: "Pada mulanya Allah menciptakan langit dan bumi." },
      { number: "2", text: "Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya, dan Roh Allah melayang-layang di atas permukaan air." },
      { number: "3", text: "Berfirmanlah Allah: 'Jadilah terang.' Lalu terang itu jadi." }
    ]
  }
};

const ChapterScreen = ({ route, navigation }) => {
  const { bookId, bookName, chapter, highlightVerses = [] } = route.params;

  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState(new Set(highlightVerses));
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isBookmarkModalVisible, setIsBookmarkModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('Penciptaan');
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {selectedVerses.size > 0 ? (
            <>
              <TouchableOpacity 
                onPress={handleShare}
                style={styles.headerButton}
              >
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsBookmarkModalVisible(true)}
                style={styles.headerButton}
              >
                <Ionicons name="bookmark-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleClearSelection}
                style={styles.headerButton}
              >
                <Ionicons name="close-circle-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              onPress={() => setIsMenuVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, selectedVerses]);

  useEffect(() => {
    loadData();
  }, [bookId, chapter]);

  useEffect(() => {
    if (highlightVerses?.length > 0) {
      setSelectedVerses(new Set(highlightVerses));
    }
  }, [highlightVerses]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchVerses(),
        checkBookmarkedVerses()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, []);

  const getStaticVerse = (bookName, chapter) => {
    try {
      return defaultVerses[bookName]?.[parseInt(chapter)] || null;
    } catch {
      return null;
    }
  };

  const generateFallbackVerses = () => {
    const verseCount = verseCounts[bookName] || 30;
    return Array.from({ length: verseCount }, (_, index) => ({
      number: (index + 1).toString(),
      text: `${bookName} ${chapter}:${index + 1} - Ayat akan ditampilkan di sini.`
    }));
  };

  const fetchVerses = async () => {
    setError(null);

    const staticVerses = getStaticVerse(bookName, chapter);
    if (staticVerses) {
      setVerses(staticVerses);
      return;
    }

    try {
      const fallbackVerses = generateFallbackVerses();
      setVerses(fallbackVerses);

      const response = await axios.get(
        `https://bible-api.com/${encodeURIComponent(bookName)}+${chapter}`,
        { timeout: 5000 }
      );

      if (response.data && response.data.verses) {
        const formattedVerses = response.data.verses.map(verse => ({
          number: verse.verse.toString(),
          text: verse.text.trim()
        }));
        setVerses(formattedVerses);
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
      setError('Menggunakan data offline. Tarik layar ke bawah untuk memuat ulang.');
    }
  };

  const checkBookmarkedVerses = async () => {
    try {
      const bookmarks = await BookmarkManager.getBookmarks();
      const bookmarkedSet = new Set();
      
      bookmarks.forEach(bookmark => {
        if (bookmark.book === bookName && bookmark.chapter === parseInt(chapter)) {
          bookmark.verses.forEach(verse => {
            bookmarkedSet.add(verse.number);
          });
        }
      });
      
      setBookmarkedVerses(bookmarkedSet);
    } catch (error) {
      console.error('Error checking bookmarked verses:', error);
    }
  };

  const handleBookmark = async () => {
    if (selectedVerses.size === 0) {
      Alert.alert('Info', 'Pilih ayat yang ingin ditandai');
      return;
    }

    try {
      if (!Array.isArray(verses)) {
        throw new Error('Data ayat tidak tersedia');
      }

      const selectedVerseObjects = verses
        .filter(verse => selectedVerses.has(verse.number))
        .map(verse => ({
          number: verse.number,
          text: verse.text
        }));

      if (selectedVerseObjects.length === 0) {
        throw new Error('Tidak dapat menemukan ayat yang dipilih');
      }

      const bookmark = {
        id: Date.now().toString(),
        verses: selectedVerseObjects,
        book: bookName,
        chapter: parseInt(chapter),
        category: selectedCategory,
        bookId,
        createdAt: new Date().toISOString()
      };

      await BookmarkManager.addBookmark(bookmark);
      
      setIsBookmarkModalVisible(false);
      handleClearSelection();
      await checkBookmarkedVerses();
      
      Alert.alert(
        'Berhasil',
        'Ayat telah ditambahkan ke markah',
        [
          {
            text: 'Lihat Markah',
            onPress: () => {
              navigation.navigate('BookmarkScreen', {
                fromChapter: true,
                bookId,
                bookName,
                chapter
              });
            }
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error adding bookmark:', error);
      Alert.alert('Error', 'Gagal menambahkan markah: ' + error.message);
    }
  };

  const handleDeleteBookmark = async (verseNumber) => {
    try {
      const bookmarks = await BookmarkManager.getBookmarks();
      const bookmark = bookmarks.find(b => 
        b.book === bookName && 
        b.chapter === parseInt(chapter) && 
        b.verses.some(v => v.number === verseNumber)
      );

      if (bookmark) {
        setBookmarkToDelete(bookmark);
        setIsDeleteModalVisible(true);
      }
    } catch (error) {
      console.error('Error preparing to delete bookmark:', error);
      Alert.alert('Error', 'Gagal mempersiapkan penghapusan markah');
    }
  };

  const confirmDeleteBookmark = async () => {
    try {
      await BookmarkManager.deleteBookmark(bookmarkToDelete.id);
      await checkBookmarkedVerses();
      setIsDeleteModalVisible(false);
      setBookmarkToDelete(null);
      Alert.alert('Berhasil', 'Markah telah dihapus');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      Alert.alert('Error', 'Gagal menghapus markah');
    }
  };

  const handleVersePress = (verseNumber) => {
    if (bookmarkedVerses.has(verseNumber)) {
      handleDeleteBookmark(verseNumber);
      return;
    }

    setSelectedVerses(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(verseNumber)) {
        newSelected.delete(verseNumber);
      } else {
        newSelected.add(verseNumber);
      }
      return newSelected;
    });
  };

  const handleClearSelection = () => {
    setSelectedVerses(new Set());
  };

  const handleShare = async () => {
    try {
      const selectedVerseTexts = verses
        .filter(verse => selectedVerses.has(verse.number))
        .map(verse => `${bookName} ${chapter}:${verse.number} - ${verse.text}`)
        .join('\n\n');

      await Share.share({
        message: selectedVerseTexts,
        title: `${bookName} ${chapter}`
      });
    } catch (error) {
      console.error('Error sharing verses:', error);
      Alert.alert('Error', 'Gagal membagikan ayat');
    }
  };

  const getLongPressOptions = (verse) => {
    const buttons = [];

    if (bookmarkedVerses.has(verse.number)) {
      buttons.push({
        text: 'Hapus Markah',
        onPress: () => handleDeleteBookmark(verse.number),
        style: 'destructive'
      });
    } else {
      buttons.push({
        text: 'Tandai Ayat',
        onPress: () => {
          setSelectedVerses(new Set([verse.number]));
          setIsBookmarkModalVisible(true);
        }
      });
    }

    buttons.push({
      text: 'Bagikan',
      onPress: async () => {
        try {
          await Share.share({
            message: `${bookName} ${chapter}:${verse.number} - ${verse.text}`,
            title: `${bookName} ${chapter}:${verse.number}`
          });
        } catch (error) {
          console.error('Error sharing verse:', error);
          Alert.alert('Error', 'Gagal membagikan ayat');
        }
      }
    });

    buttons.push({ text: 'Batal', style: 'cancel' });

    return Alert.alert(
      `${bookName} ${chapter}:${verse.number}`,
      verse.text,
      buttons
    );
  };

  const getFontSize = () => {
    switch (selectedFontSize) {
      case 'small': return 14;
      case 'large': return 18;
      default: return 16;
    }
  };

  const renderOptionsMenu = () => (
    <Modal
      visible={isMenuVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsMenuVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsMenuVisible(false)}
      >
        <View style={styles.optionsContainer}>
          <Text style={styles.optionHeader}>Ukuran Font</Text>
          {['small', 'medium', 'large'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionItem,
                selectedFontSize === size && styles.selectedOption
              ]}
              onPress={() => {
                setSelectedFontSize(size);
                setIsMenuVisible(false);
              }}
            >
              <Ionicons 
                name="text" 
                size={size === 'small' ? 18 : size === 'medium' ? 22 : 26} 
                color="#4B5563" 
              />
              <Text style={styles.optionText}>
                {size === 'small' ? 'Kecil' : size === 'medium' ? 'Sedang' : 'Besar'}
              </Text>
              {selectedFontSize === size && (
                <Ionicons name="checkmark" size={20} color="#6366F1" style={styles.checkmark} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderBookmarkModal = () => (
    <Modal
      visible={isBookmarkModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsBookmarkModalVisible(
  false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsBookmarkModalVisible(false)}
      >
        <View style={styles.bookmarkModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah ke Markah</Text>
            <TouchableOpacity onPress={() => setIsBookmarkModalVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.selectedVersesPreview}>
            <Text style={styles.previewTitle}>Ayat Terpilih:</Text>
            <Text style={styles.previewText}>
              {bookName} {chapter}:{Array.from(selectedVerses).join(', ')}
            </Text>
          </View>

          <Text style={styles.categoryLabel}>Pilih Kategori:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && {
                      backgroundColor: category.color + '20',
                      borderColor: category.color
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category.id && { color: category.color }
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={handleBookmark}
          >
            <Text style={styles.bookmarkButtonText}>Tambah ke Markah</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderDeleteBookmarkModal = () => (
    <Modal
      visible={isDeleteModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsDeleteModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalTitle}>Hapus Markah?</Text>
          <Text style={styles.deleteModalText}>
            Apakah Anda yakin ingin menghapus markah ini?
          </Text>
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.cancelButton]}
              onPress={() => setIsDeleteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteButton]}
              onPress={confirmDeleteBookmark}
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRefresh}
        >
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderOptionsMenu()}
      {renderBookmarkModal()}
      {renderDeleteBookmarkModal()}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.chapterTitle}>
          {bookName} {chapter}
        </Text>
        {verses.map((verse) => (
          <TouchableOpacity 
            key={verse.number}
            style={[
              styles.verseContainer,
              selectedVerses.has(verse.number) && styles.selectedVerseContainer,
              bookmarkedVerses.has(verse.number) && styles.bookmarkedVerseContainer
            ]}
            onPress={() => handleVersePress(verse.number)}
            onLongPress={() => getLongPressOptions(verse)}
            activeOpacity={0.7}
          >
            <View style={styles.verseNumberContainer}>
              <Text style={[
                styles.verseNumber,
                selectedVerses.has(verse.number) && styles.selectedVerseText
              ]}>
                {verse.number}
              </Text>
              {bookmarkedVerses.has(verse.number) && (
                <Ionicons 
                  name="bookmark" 
                  size={14} 
                  color="#6366F1" 
                  style={styles.bookmarkIcon}
                />
              )}
            </View>
            <Text style={[
              styles.verseText,
              { fontSize: getFontSize() },
              selectedVerses.has(verse.number) && styles.selectedVerseText
            ]}>
              {verse.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContainer: {
    padding: 16,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  verseContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedVerseContainer: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderBottomWidth: 0,
    marginBottom: 1,
  },
  bookmarkedVerseContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#6366F1',
  },
  verseNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    marginRight: 8,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  bookmarkIcon: {
    marginLeft: 4,
  },
  verseText: {
    flex: 1,
    lineHeight: 24,
    color: '#1F2937',
  },
  selectedVerseText: {
    color: '#6366F1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  optionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
  },
  checkmark: {
    marginLeft: 'auto',
  },
  bookmarkModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectedVersesPreview: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  bookmarkButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  bookmarkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 'auto',
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteModalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default ChapterScreen;