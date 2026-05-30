import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    // Bọc toàn bộ app để tính năng Zoom hoạt động được
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#27AE60',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: { paddingBottom: 5, height: 60 }
      }}>
        <Tabs.Screen 
          name="index" 
          options={{ title: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} 
        />
        <Tabs.Screen 
          name="map" 
          options={{ title: 'Map', tabBarIcon: ({color}) => <Ionicons name="map" size={24} color={color} /> }} 
        />
        <Tabs.Screen 
          name="credit" 
          options={{ title: 'Credit', tabBarIcon: ({color}) => <Ionicons name="information-circle" size={24} color={color} /> }} 
        />
        <Tabs.Screen 
          name="rating" 
          options={{ title: 'Rating', tabBarIcon: ({color}) => <Ionicons name="star" size={24} color={color} /> }} 
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}