import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerseItem = ({ verse, onPress, onLongPress, isHighlighted, fontSize }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isHighlighted && styles.highlighted]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={[styles.verseNumber, { fontSize }]}>{verse.number}</Text>
      <View style={styles.contentContainer}>
        <Text style={[styles.verseText, { fontSize }]}>{verse.text}</Text>
        {isHighlighted && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="content-copy" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="bookmark-border" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  highlighted: {
    backgroundColor: '#f0f0f0',
  },
  verseNumber: {
    width: 24,
    marginRight: 8,
    color: '#666',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  verseText: {
    color: '#333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default VerseItem;