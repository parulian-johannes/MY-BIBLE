import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MainFeaturesScreen = () => {
  const features = [
    {
      title: 'Pembacaan Alkitab',
      icon: 'book-outline',
      description: 'Baca Alkitab dalam terjemahan modern dengan tampilan yang nyaman.',
      points: [
        'Navigasi mudah antar kitab dan pasal',
        'Tampilan teks yang jelas dan mudah dibaca',
        'Opsi ukuran teks yang dapat disesuaikan',
        'Mode gelap untuk membaca di malam hari'
      ]
    },
    {
      title: 'Penanda Ayat',
      icon: 'bookmark-outline',
      description: 'Tandai dan simpan ayat-ayat favorit Anda untuk referensi di kemudian hari.',
      points: [
        'Markah ayat dengan mudah',
        'Tambahkan catatan pribadi',
        'Organisasi markah dengan kategori',
        'Pencarian cepat ayat yang ditandai'
      ]
    },
    {
      title: 'Pengaturan Tampilan',
      icon: 'settings-outline',
      description: 'Sesuaikan tampilan aplikasi sesuai preferensi Anda.',
      points: [
        'Pilihan ukuran teks',
        'Tema terang dan gelap',
        'Penyesuaian jenis huruf',
        'Pengaturan tampilan layar'
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.featureHeader}>
            <Ionicons name={feature.icon} size={24} color="#007AFF" />
            <Text style={styles.featureTitle}>{feature.title}</Text>
          </View>
          <Text style={styles.description}>{feature.description}</Text>
          {feature.points.map((point, pointIndex) => (
            <View key={pointIndex} style={styles.pointContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    lineHeight: 24,
  },
  pointContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingLeft: 8,
  },
  bullet: {
    width: 20,
    fontSize: 16,
    color: '#007AFF',
  },
  pointText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default MainFeaturesScreen;