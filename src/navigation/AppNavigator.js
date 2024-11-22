import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import 'react-native-gesture-handler';

// Import screens
import BibleScreen from '../screens/BibleScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import ChapterScreen from '../screens/ChapterScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Beranda',
          tabBarLabel: 'Beranda'
        }}
      />
      <Tab.Screen 
        name="Bookmarks" 
        component={BookmarkScreen} 
        options={{ 
          title: 'Markah',
          tabBarLabel: 'Markah',
          headerShown: true,
          headerTitle: 'Markah Saya',
          headerStyle: {
            backgroundColor: '#6366F1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Pengaturan',
          tabBarLabel: 'Pengaturan'
        }}
      />
    </Tab.Navigator>
  );
};

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: '#6366F1',
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
  cardStyle: { backgroundColor: '#fff' },
  headerBackImage: () => (
    <Ionicons 
      name="chevron-back" 
      size={24} 
      color="#fff" 
      style={{ marginLeft: 8 }}
    />
  ),
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
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
              onPress={() => navigation.navigate('Bookmarks', {
                fromChapter: true,
                bookId: route.params?.bookId,
                bookName: route.params?.bookName,
                chapter: route.params?.chapter
              })}
            >
              <Ionicons name="bookmark-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Bookmarks"
        component={BookmarkScreen}
        options={{ 
          title: 'Markah Saya',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 15 }}
              onPress={() => {/* Handle bookmark filter/sort */}}
            >
              <Ionicons name="filter-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default AppNavigator;