import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Platform } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Memperpanjang durasi loading menjadi 5 detik (5000 milliseconds)
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/bible.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>My Bible</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').height * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default SplashScreen;