import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function BibleScreen({ route, navigation }) {
  const { bibleName, bookId, totalChapters } = route.params;
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gunakan data statis untuk sementara
      const chapterArray = Array.from({ length: totalChapters }, (_, i) => ({
        id: i + 1,
        chapter: i + 1,
        verses: 30 // Default verses count
      }));
      
      setChapters(chapterArray);
      setLoading(false);
    } catch (err) {
      console.error('Error loading chapters:', err);
      setError('Gagal memuat data pasal. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleChapterPress = (chapter) => {
    navigation.navigate('Chapter', {
      bibleName: bibleName,
      chapterName: `Pasal ${chapter}`,
      bookId: bookId,
      chapter: chapter
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Memuat pasal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadChapters}
        >
          <Text style={styles.retryButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bookName}>{bibleName}</Text>
        <Text style={styles.chaptersInfo}>{totalChapters} Pasal</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chaptersGrid}>
          {chapters.map((item) => (
            <TouchableOpacity
              key={item.chapter}
              style={styles.chapterCard}
              onPress={() => handleChapterPress(item.chapter)}
              activeOpacity={0.7}
            >
              <Text style={styles.chapterNumber}>{item.chapter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6366F1',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bookName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chaptersInfo: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  chapterCard: {
    width: '23%', // Approximately 4 cards per row with spacing
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chapterNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
});