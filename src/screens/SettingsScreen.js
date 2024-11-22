import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

// Definisi tema untuk mode terang dan gelap
const theme = {
  light: {
    background: '#F9FAFB',
    text: '#1F2937',
    subText: '#6B7280',
    border: '#E5E7EB',
    card: '#FFFFFF',
    buttonBg: '#F3F4F6',
    modalOverlay: 'rgba(0,0,0,0.5)',
    switchTrackColor: {
      false: '#D1D5DB',
      true: '#93C5FD'
    },
    switchThumbColor: {
      false: '#F3F4F6',
      true: '#6366F1'
    }
  },
  dark: {
    background: '#111827',
    text: '#F9FAFB',
    subText: '#9CA3AF',
    border: '#374151',
    card: '#1F2937',
    buttonBg: '#374151',
    modalOverlay: 'rgba(0,0,0,0.7)',
    switchTrackColor: {
      false: '#4B5563',
      true: '#93C5FD'
    },
    switchThumbColor: {
      false: '#6B7280',
      true: '#6366F1'
    }
  }
};

// Fungsi untuk mendapatkan ukuran font
const getFontSizeStyle = (size) => {
  switch (size) {
    case 'small':
      return {
        textSize: 14,
        versionTextSize: 12
      };
    case 'medium':
      return {
        textSize: 16,
        versionTextSize: 14
      };
    case 'large':
      return {
        textSize: 18,
        versionTextSize: 16
      };
    default:
      return {
        textSize: 16,
        versionTextSize: 14
      };
  }
};

const SettingsScreen = () => {
  const systemColorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [showAbout, setShowAbout] = useState(false);
  const fontSizes = getFontSizeStyle(fontSize);

  // Mendapatkan tema aktif berdasarkan mode gelap
  const activeTheme = darkMode ? theme.dark : theme.light;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        setDarkMode(parsedSettings.darkMode);
        setNotifications(parsedSettings.notifications);
        setFontSize(parsedSettings.fontSize || 'medium');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      const parsedSettings = settings !== null ? JSON.parse(settings) : {};
      const newSettings = {
        ...parsedSettings,
        [key]: value,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDarkModeToggle = async (value) => {
    setDarkMode(value);
    await saveSettings('darkMode', value);
  };

  const handleNotificationsToggle = async (value) => {
    setNotifications(value);
    await saveSettings('notifications', value);
  };

  const handleFontSizeChange = async (size) => {
    setFontSize(size);
    await saveSettings('fontSize', size);
  };

  const renderNavbar = () => (
    <View style={styles.navbar}>
      <View style={styles.navbarInner}>
        <View style={styles.navbarContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="settings" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.navbarTitle}>Pengaturan</Text>
        </View>
      </View>
    </View>
  );

  const AboutModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAbout}
      onRequestClose={() => setShowAbout(false)}
      statusBarTranslucent
    >
      <View style={[styles.modalContainer, { backgroundColor: activeTheme.modalOverlay }]}>
        <View style={[styles.modalContent, { 
          backgroundColor: activeTheme.card,
          borderColor: activeTheme.border 
        }]}>
          <View style={[styles.modalHeader, { borderBottomColor: activeTheme.border }]}>
            <Text style={[styles.modalTitle, { color: activeTheme.text }]}>
              Tentang My Bible
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAbout(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={activeTheme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.aboutSection}>
              <Text style={[styles.aboutTitle, { color: activeTheme.text }]}>
                My Bible v1.0.0
              </Text>
              
              <Text style={[styles.aboutDescription, { color: activeTheme.subText }]}>
                My Bible adalah aplikasi alkitab digital yang dirancang untuk membantu Anda dalam perjalanan rohani Anda. Aplikasi ini menyediakan akses mudah ke Alkitab dalam berbagai versi terjemahan, dilengkapi dengan fitur-fitur yang memudahkan Anda dalam mempelajari dan merenungkan Firman Tuhan.
              </Text>
              
              <Text style={[styles.featureHeader, { color: activeTheme.text }]}>
                Fitur Utama:
              </Text>
              
              <View style={styles.featureList}>
                {[
                  'Membaca Alkitab secara online dan offline',
                  'Membuat catatan dan highlight ayat favorit',
                  'Mendapatkan renungan harian',
                  'Membuat rencana pembacaan Alkitab',
                  'Berbagi ayat ke media sosial',
                  'Pencarian ayat yang mudah dan cepat',
                  'Mendukung mode gelap untuk kenyamanan membaca',
                  'Pengaturan ukuran teks yang dapat disesuaikan'
                ].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={20} 
                      color="#6366F1"
                    />
                    <Text style={[styles.featureText, { color: activeTheme.text }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.copyright, { color: activeTheme.subText }]}>
                © 2024 My Bible. Dikembangkan dengan ❤️ untuk komunitas Kristiani.
                {'\n'}Semua hak cipta dilindungi.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderSettingItem = (icon, title, right) => (
    <View style={[styles.settingItem, { 
      backgroundColor: activeTheme.card,
      borderBottomColor: activeTheme.border 
    }]}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#6366F1" />
        </View>
        <Text style={[styles.settingText, { 
          color: activeTheme.text,
          fontSize: fontSizes.textSize 
        }]}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]} edges={['top']}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {renderNavbar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: activeTheme.subText }]}>
            Tampilan
          </Text>
          
          {renderSettingItem(
            "moon-outline",
            "Mode Gelap",
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={activeTheme.switchTrackColor}
              thumbColor={darkMode ? 
                activeTheme.switchThumbColor.true : 
                activeTheme.switchThumbColor.false
              }
            />
          )}

          {renderSettingItem(
            "text-outline",
            "Ukuran Teks",
            <View style={styles.fontSizeButtons}>
              {['small', 'medium', 'large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontButton,
                    { backgroundColor: activeTheme.buttonBg },
                    fontSize === size && styles.selectedFont,
                  ]}
                  onPress={() => handleFontSizeChange(size)}
                >
                  <Text
                    style={[
                      styles.fontButtonText,
                      { color: activeTheme.text },
                      { fontSize: size === 'small' ? 14 : size === 'medium' ? 18 : 22 },
                      fontSize === size && styles.selectedFontText,
                    ]}
                  >
                    A
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: activeTheme.subText }]}>
            Notifikasi
          </Text>
          {renderSettingItem(
            "notifications-outline",
            "Notifikasi Bacaan Harian",
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={activeTheme.switchTrackColor}
              thumbColor={notifications ? 
                activeTheme.switchThumbColor.true : 
                activeTheme.switchThumbColor.false
              }
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: activeTheme.subText }]}>
            Tentang
          </Text>
          <TouchableOpacity onPress={() => setShowAbout(true)}>
            {renderSettingItem(
              "information-circle-outline",
              "Tentang My Bible",
              <Ionicons name="chevron-forward-outline" size={24} color={activeTheme.subText} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AboutModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  settingText: {
    marginLeft: 12,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  fontButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  selectedFont: {
    backgroundColor: '#6366F1',
  },
  selectedFontText: {
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    padding: 16,
  },
  aboutSection: {
    gap: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureHeader: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  switchContainer: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  iconText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  itemSeparator: {
    height: 1,
    opacity: 0.2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    paddingBottom: 24,
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

export default SettingsScreen;