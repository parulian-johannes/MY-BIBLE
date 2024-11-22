import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { FontProvider } from './src/context/FontContext';

// Import screens
import BibleScreen from './src/screens/BibleScreen';
import BookmarkScreen from './src/screens/BookmarkScreen';
import ChapterScreen from './src/screens/ChapterScreen';
import HomeScreen from './src/screens/HomeScreen';
import HelpScreen from './src/screens/HelpScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';

// Import help screens
import AppUsageScreen from './src/screens/help/AppUsageScreen';
import MainFeaturesScreen from './src/screens/help/MainFeaturesScreen';
import FAQScreen from './src/screens/help/FAQScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define HomeTabs as a constant component
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Beranda' }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarkScreen} 
        options={{ title: 'Markah' }}
      />
      <Tab.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{ title: 'Bantuan' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Pengaturan' }}
      />
    </Tab.Navigator>
  );
};

// Custom hook untuk mendapatkan header styles berdasarkan ukuran font
const useHeaderStyles = () => {
  return {
    headerStyle: {
      backgroundColor: '#007AFF',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitleVisible: false,
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerTitleAlign: 'center',
  };
};

// Define MainStack as a constant component
const MainStack = () => {
  const headerStyles = useHeaderStyles();

  return (
    <Stack.Navigator
      screenOptions={headerStyles}
    >
      <Stack.Screen 
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MainTabs" 
        component={HomeTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bible"
        component={BibleScreen}
        options={({ route }) => ({ 
          title: route.params?.bibleName || 'Alkitab',
        })}
      />
      <Stack.Screen
        name="ChapterScreen"
        component={ChapterScreen}
        options={({ route }) => ({ 
          title: `${route.params?.bookName || ''} ${route.params?.chapter || ''}`,
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 15 }}
              onPress={() => {/* Handle menu action */}}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Help Section Screens */}
      <Stack.Screen
        name="AppUsage"
        component={AppUsageScreen}
        options={{ 
          title: 'Cara Menggunakan Aplikasi',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="MainFeatures"
        component={MainFeaturesScreen}
        options={{ 
          title: 'Fitur Utama',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ 
          title: 'Pertanyaan Umum',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Main App component
const App = () => {
  return (
    <FontProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </FontProvider>
  );
};

export default App;