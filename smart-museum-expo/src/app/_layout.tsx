import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: { 
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: '#111111',
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: '#222222'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
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