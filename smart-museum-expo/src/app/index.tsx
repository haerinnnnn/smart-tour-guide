import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import { useBleScanner } from '../hooks/useBleScanner';

export default function AppIndex() {
    const { startScan, stopScan, isScanning, nearestBeacon } = useBleScanner();
    const [artifactInfo, setArtifactInfo] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (nearestBeacon) {
            fetchArtifactData(nearestBeacon.uuid, nearestBeacon.major, nearestBeacon.minor);
        } else {
            setArtifactInfo(null);
        }
    }, [nearestBeacon?.uuid, nearestBeacon?.major, nearestBeacon?.minor]);

    const fetchArtifactData = async (uuid: string, major: number, minor: number) => {
        try {
            setLoading(true);
            const hostUri = Constants.expoConfig?.hostUri;
            const SERVER_IP = hostUri ? hostUri.split(':')[0] : '192.168.1.221';
            
            const API_URL = `http://${SERVER_IP}:3000/api/artifacts/detect?uuid=${uuid}&major=${major}&minor=${minor}`;
            const response = await fetch(API_URL);
            const json = await response.json();
            
            if (json.success) setArtifactInfo(json.data);
        } catch (error) {
            console.error('❌ Lỗi kết nối Server:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111" />
            
            {/* PHẦN HIỂN THỊ NỘI DUNG (CUỘN ĐƯỢC) */}
            <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {!artifactInfo && !loading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>THE MASTERPIECES TOUR</Text>
                        <Text style={styles.emptySubtitle}>
                            {isScanning ? 'Đang dò tìm kiệt tác nghệ thuật xung quanh bạn...' : 'Bật quét sóng để khám phá'}
                        </Text>
                    </View>
                )}

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                )}

                {!loading && artifactInfo && (
                    <View>
                        {artifactInfo.image_url ? (
                            <Image 
                                source={{ uri: artifactInfo.image_url }} 
                                style={styles.heroImage} 
                                resizeMode="cover"
                            />
                        ) : null}
                        <View style={styles.contentBox}>
                            <Text style={styles.title}>{artifactInfo.title.toUpperCase()}</Text>
                            <Text style={styles.subtitle}>Tác giả: {artifactInfo.author || 'Ẩn danh'}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.metaLabel}>Nơi trưng bày:</Text>
                            <Text style={styles.metaValue}>{artifactInfo.location_name}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.sectionTitle}>Introduction</Text>
                            <Text style={styles.description}>{artifactInfo.description}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* THANH ĐIỀU KHIỂN DƯỚI CÙNG */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={[styles.button, isScanning ? styles.buttonStop : styles.buttonStart]} 
                    onPress={isScanning ? stopScan : startScan}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.buttonText, isScanning ? styles.textWhite : styles.textBlack]}>
                        {isScanning ? 'DỪNG THAM QUAN' : 'BẮT ĐẦU THAM QUAN'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' }, // Nền đen tuyền
    scrollContent: { flexGrow: 1, paddingBottom: 40 },
    
    // Trạng thái chờ
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, marginTop: 100 },
    emptyTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: 2, marginBottom: 15 },
    emptySubtitle: { color: '#888', fontSize: 16, textAlign: 'center', lineHeight: 24 },
    loadingContainer: { marginTop: 150, alignItems: 'center' },

    // Phong cách ảnh tràn viền
    heroImage: { width: '100%', height: 480 },
    
    // Khung nội dung
    contentBox: { paddingHorizontal: 24, paddingVertical: 30 },
    badge: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginBottom: 20 },
    badgeText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
    
    // Typography đỉnh cao
    title: { color: '#FFF', fontSize: 28, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
    subtitle: { color: '#AAA', fontSize: 16, fontStyle: 'italic' },
    
    divider: { height: 1, backgroundColor: '#333', marginVertical: 24 },
    
    metaLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 6 },
    metaValue: { color: '#FFF', fontSize: 15, fontWeight: '500' },
    
    sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: '600', marginBottom: 16 },
    description: { color: '#CCC', fontSize: 16, lineHeight: 28, textAlign: 'justify' },

    // Thanh điều khiển dính dưới đáy
    bottomBar: { padding: 20, backgroundColor: '#111', borderTopWidth: 1, borderColor: '#222' },
    button: { paddingVertical: 18, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    buttonStart: { backgroundColor: '#FFF' }, // Nút trắng chữ đen cực sang
    buttonStop: { backgroundColor: '#222', borderWidth: 1, borderColor: '#555' }, // Nút đen viền xám
    
    buttonText: { fontSize: 15, fontWeight: 'bold', letterSpacing: 1.5 },
    textBlack: { color: '#000' },
    textWhite: { color: '#FFF' }
});