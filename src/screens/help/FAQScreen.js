import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const FAQScreen = () => {
  const faqs = [
    {
      question: 'Bagaimana cara menandai ayat?',
      answer: 'Untuk menandai ayat, tekan dan tahan ayat yang ingin Anda tandai. Akan muncul menu opsi, pilih "Tambah ke Markah". Anda juga dapat menambahkan catatan pribadi untuk ayat tersebut. Semua ayat yang ditandai dapat dilihat di menu Markah.'
    },
    {
      question: 'Bagaimana mengubah ukuran teks?',
      answer: 'Untuk mengubah ukuran teks, buka menu Pengaturan, pilih "Tampilan", kemudian gunakan slider atau tombol + / - untuk menyesuaikan ukuran teks sesuai keinginan Anda. Perubahan akan langsung terlihat di layar.'
    },
    {
      question: 'Bagaimana mencari ayat tertentu?',
      answer: 'Untuk mencari ayat tertentu, gunakan fitur pencarian di bagian atas layar. Anda dapat mencari berdasarkan kata kunci, referensi ayat (misal: Yohanes 3:16), atau topik. Hasil pencarian akan menampilkan semua ayat yang relevan.'
    },
    {
      question: 'Apakah saya bisa membaca offline?',
      answer: 'Ya, Anda bisa membaca Alkitab secara offline. Saat pertama kali menggunakan aplikasi, konten akan diunduh ke perangkat Anda. Setelah itu, Anda tidak memerlukan koneksi internet untuk membaca.'
    },
    {
      question: 'Bagaimana cara berbagi ayat?',
      answer: 'Untuk berbagi ayat, tekan dan tahan ayat yang ingin Anda bagikan, kemudian pilih opsi "Bagikan". Anda dapat membagikan ayat melalui berbagai platform seperti WhatsApp, Email, atau media sosial lainnya.'
    },
    {
      question: 'Bagaimana cara mengganti terjemahan Alkitab?',
      answer: 'Untuk mengganti terjemahan, buka menu pengaturan dan pilih "Terjemahan". Pilih versi terjemahan yang Anda inginkan dari daftar yang tersedia. Perubahan akan langsung diterapkan ke seluruh aplikasi.'
    },
    {
      question: 'Apakah saya bisa membuat catatan pribadi?',
      answer: 'Ya, Anda bisa membuat catatan pribadi untuk setiap ayat. Tekan dan tahan ayat yang ingin Anda beri catatan, pilih "Tambah Catatan", kemudian tuliskan catatan Anda. Catatan dapat dilihat dan diedit kembali melalui menu Markah.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
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
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default FAQScreen;