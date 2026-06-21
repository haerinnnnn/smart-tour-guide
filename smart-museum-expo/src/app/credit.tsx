import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CreditScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111" />
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="images" size={40} color="#111" />
                    </View>
                    <Text style={styles.appName}>SMART MUSEUM GUIDE</Text>
                    <Text style={styles.version}>Phiên bản 1.0.0</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>THÔNG TIN DỰ ÁN</Text>
                    
                    <View style={styles.row}>
                        <Ionicons name="person" size={20} color="#AAA" />
                        <Text style={styles.text}>Sinh viên: Bùi Đức Dũng & Phạm Thái Hải</Text>
                    </View>
                    
                    <View style={styles.row}>
                        <Ionicons name="ribbon" size={20} color="#AAA" />
                        <Text style={styles.text}>GVHD: TS. Vũ Song Tùng</Text>
                    </View>
                    
                    <View style={styles.row}>
                        <Ionicons name="school" size={20} color="#AAA" />
                        <Text style={styles.text}>Đại học Bách Khoa Hà Nội</Text>
                    </View>

                    <View style={styles.row}>
                        <Ionicons name="desktop" size={20} color="#AAA" />
                        <Text style={styles.text}>Học phần: Kỹ thuật PM ứng dụng (ET3260)</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>CÔNG NGHỆ & TÀI NGUYÊN</Text>
                    <Text style={styles.description}>
                        Hệ thống định vị vi mô được phát triển dựa trên nền tảng React Native (Expo) kết hợp với vi điều khiển ESP32 phát sóng theo chuẩn giao thức iBeacon.
                    </Text>
                    
                    <View style={styles.divider} />
                    
                    <Text style={styles.subtext}>Tài nguyên mã nguồn mở:</Text>
                    <Text style={styles.bullet}>• Thư viện: react-native-ble-plx</Text>
                    <Text style={styles.bullet}>• Bản đồ: react-native-zoomable-view</Text>
                    <Text style={styles.bullet}>• Giao diện & Icon: Expo Router, Ionicons</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    contentContainer: { paddingTop: 40, paddingHorizontal: 24, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 40 },
    iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    appName: { fontSize: 20, fontWeight: '800', color: '#FFF', letterSpacing: 2 },
    version: { fontSize: 14, color: '#888', marginTop: 5 },
    card: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', letterSpacing: 1.5, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    text: { fontSize: 15, color: '#CCC', marginLeft: 15, flex: 1, lineHeight: 22 },
    description: { fontSize: 15, color: '#CCC', lineHeight: 26, marginBottom: 10, textAlign: 'justify' },
    divider: { height: 1, backgroundColor: '#333', marginVertical: 16 },
    subtext: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 12 },
    bullet: { fontSize: 15, color: '#CCC', marginLeft: 5, marginBottom: 8 }
});