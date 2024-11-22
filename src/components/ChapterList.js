import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const ChapterList = ({ chapters, onSelectChapter, selectedChapter }) => {
  const renderChapterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chapterItem,
        selectedChapter === item.id && styles.selectedChapter,
      ]}
      onPress={() => onSelectChapter(item)}
    >
      <Text
        style={[
          styles.chapterNumber,
          selectedChapter === item.id && styles.selectedChapterText,
        ]}
      >
        {item.number}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        renderItem={renderChapterItem}
        keyExtractor={(item) => item.id}
        numColumns={5}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    padding: 4,
  },
  chapterItem: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
  },
  selectedChapter: {
    backgroundColor: '#007AFF',
  },
  chapterNumber: {
    fontSize: 16,
    color: '#333',
  },
  selectedChapterText: {
    color: '#fff',
  },
});

export default ChapterList;