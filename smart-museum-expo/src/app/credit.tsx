import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CreditScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="images" size={50} color="#FFF" />
                </View>
                <Text style={styles.appName}>Smart Museum Guide</Text>
                <Text style={styles.version}>Phiên bản 1.0.0</Text>
            </View>

            {}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Thông tin dự án</Text>
                
                <View style={styles.row}>
                    <Ionicons name="person" size={20} color="#3498DB" />
                    <Text style={styles.text}>Sinh viên thực hiện: Bùi Đức Dũng + Phạm Thái Hải</Text>
                </View>
                
                <View style={styles.row}>
                    <Ionicons name="ribbon" size={20} color="#E67E22" />
                    <Text style={styles.text}>Giảng viên hướng dẫn: TS. Vũ Song Tùng</Text>
                </View>
                
                <View style={styles.row}>
                    <Ionicons name="school" size={20} color="#E74C3C" />
                    <Text style={styles.text}>Đại học Bách Khoa Hà Nội</Text>
                </View>

                <View style={styles.row}>
                    <Ionicons name="desktop" size={20} color="#27AE60" />
                    <Text style={styles.text}>Học phần: Kỹ Thuật phầm mềm ứng dụng (ET3260)</Text>
                </View>
            </View>

            {}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Công nghệ & Tài nguyên</Text>
                
                <Text style={styles.description}>
                    Hệ thống định vị vi mô được phát triển dựa trên nền tảng React Native (Expo) kết hợp với vi điều khiển ESP32 phát sóng theo chuẩn giao thức iBeacon.
                </Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.subtext}>
                    Đồ án sử dụng các tài nguyên mã nguồn mở:
                </Text>
                <Text style={styles.bullet}>• Thư viện: react-native-ble-plx</Text>
                <Text style={styles.bullet}>• Bản đồ: react-native-zoomable-view</Text>
                <Text style={styles.bullet}>• Giao diện & Icon: Expo Router, Ionicons</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    contentContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#2980B9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
        shadowColor: '#2980B9',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    version: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495E',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
        paddingBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        color: '#2C3E50',
        marginLeft: 12,
        flex: 1,
        lineHeight: 22,
    },
    description: {
        fontSize: 15,
        color: '#2C3E50',
        lineHeight: 24,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ECF0F1',
        marginVertical: 12,
    },
    subtext: {
        fontSize: 14,
        color: '#7F8C8D',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 14,
        color: '#34495E',
        marginLeft: 5,
        marginBottom: 5,
    }
});