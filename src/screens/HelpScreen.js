import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Linking,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HelpScreen = () => {
  const navigation = useNavigation();
  
  const helpSections = [
    {
      title: 'Cara Menggunakan Aplikasi',
      icon: 'book-outline',
      navigateTo: 'AppUsage',
      items: [
        'Buka aplikasi dan pilih kitab yang ingin dibaca',
        'Gunakan menu Markah untuk menyimpan ayat favorit',
        'Atur ukuran teks di menu Pengaturan'
      ]
    },
    {
      title: 'Fitur Utama',
      icon: 'star-outline',
      navigateTo: 'MainFeatures',
      items: [
        'Pembacaan Alkitab',
        'Penanda Ayat',
        'Pengaturan Tampilan'
      ]
    },
    {
      title: 'Pertanyaan Umum',
      icon: 'help-circle-outline',
      navigateTo: 'FAQ',
      items: [
        'Bagaimana cara menandai ayat?',
        'Bagaimana mengubah ukuran teks?',
        'Bagaimana mencari ayat tertentu?'
      ]
    }
  ];

  const handleContact = async () => {
    const phoneNumber = '6281290470229';
    const message = 'Halo, saya ingin mengajukan pertanyaan tentang aplikasi Alkitab:';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert(
        'Error',
        'Tidak dapat membuka WhatsApp. Pastikan WhatsApp terinstal di perangkat Anda.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSectionPress = (navigateTo) => {
    navigation.navigate(navigateTo);
  };

  const renderNavbar = () => (
    <View style={styles.navbar}>
      <View style={styles.navbarInner}>
        <View style={styles.navbarContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="help-circle" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.navbarTitle}>Pusat Bantuan</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderNavbar()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Temukan jawaban untuk pertanyaan Anda di sini
          </Text>
        </View>

        {helpSections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={styles.section}
            onPress={() => handleSectionPress(section.navigateTo)}
            activeOpacity={0.7}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name={section.icon} size={24} color="#6366F1" />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Ionicons 
                name="chevron-forward-outline" 
                size={24} 
                color="#6B7280"
              />
            </View>
            <View style={styles.itemsList}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemContainer}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.contactButton} 
          onPress={handleContact}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Hubungi Kami via WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  description: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionIcon: {
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemsList: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginRight: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default HelpScreen;