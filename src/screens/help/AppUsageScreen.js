import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppUsageScreen = () => {
  const usageGuides = [
    {
      title: 'Memulai Membaca',
      icon: 'book-outline',
      steps: [
        'Buka aplikasi dan pilih menu "Beranda"',
        'Pilih kitab yang ingin dibaca dari daftar',
        'Pilih pasal yang ingin dibaca',
        'Gulir layar untuk membaca ayat-ayat'
      ]
    },
    {
      title: 'Menggunakan Markah',
      icon: 'bookmark-outline',
      steps: [
        'Tekan dan tahan ayat yang ingin ditandai',
        'Pilih opsi "Tambah ke Markah"',
        'Tambahkan catatan jika diperlukan',
        'Akses markah melalui menu "Markah"'
      ]
    },
    {
      title: 'Menyesuaikan Tampilan',
      icon: 'settings-outline',
      steps: [
        'Buka menu "Pengaturan"',
        'Pilih ukuran teks yang nyaman',
        'Sesuaikan tema tampilan',
        'Atur preferensi tampilan lainnya'
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {usageGuides.map((guide, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.guideHeader}>
            <Ionicons name={guide.icon} size={24} color="#007AFF" />
            <Text style={styles.guideTitle}>{guide.title}</Text>
          </View>
          {guide.steps.map((step, stepIndex) => (
            <View key={stepIndex} style={styles.stepContainer}>
              <Text style={styles.stepNumber}>{stepIndex + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
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
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  stepContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingLeft: 8,
  },
  stepNumber: {
    width: 24,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default AppUsageScreen;