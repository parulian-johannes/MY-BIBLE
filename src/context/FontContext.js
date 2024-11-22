import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);
        if (parsedSettings.fontSize) {
          setFontSize(parsedSettings.fontSize);
        }
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    }
  };

  const getFontSize = (type) => {
    const sizes = {
      small: {
        header: 20,
        title: 18,
        body: 14,
        caption: 12,
        tabLabel: 10
      },
      medium: {
        header: 24,
        title: 20,
        body: 16,
        caption: 14,
        tabLabel: 12
      },
      large: {
        header: 28,
        title: 24,
        body: 18,
        caption: 16,
        tabLabel: 14
      }
    };
    return sizes[fontSize][type];
  };

  const value = {
    fontSize,
    getFontSize
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);