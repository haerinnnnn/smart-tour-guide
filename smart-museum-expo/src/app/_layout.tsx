import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import thêm công cụ này

export default function RootLayout() {
  // Lấy thông số viền màn hình của máy hiện tại
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#27AE60',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: { 
          // Tự động cộng thêm khoảng không gian của thanh điều hướng Android
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          elevation: 10, // Thêm chút bóng đổ cho đẹp
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0'
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