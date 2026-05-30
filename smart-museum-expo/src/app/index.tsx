import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBleScanner } from '../hooks/useBleScanner';

export default function AppIndex() {
    const { startScan, stopScan, isScanning, nearestBeacon } = useBleScanner();
    const [artifactInfo, setArtifactInfo] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (nearestBeacon) {
            fetchArtifactData(nearestBeacon.uuid, nearestBeacon.major, nearestBeacon.minor);
        }
    }, [nearestBeacon]);

    const fetchArtifactData = async (uuid: string, major: number, minor: number) => {
        try {
            setLoading(true);
            const API_URL = `http://192.168.1.100:3000/api/artifacts/detect?uuid=${uuid}&major=${major}&minor=${minor}`;
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
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Smart Museum Guide</Text>

            <View style={styles.infoContainer}>
                {loading && <ActivityIndicator size="large" color="#208AEF" />}
                
                {!loading && artifactInfo ? (
                    <View style={styles.card}>
                        <Text style={styles.artifactTitle}>{artifactInfo.title}</Text>
                        <Text style={styles.location}>📍 {artifactInfo.location_name}</Text>
                        <Text style={styles.description}>{artifactInfo.description}</Text>
                    </View>
                ) : (
                    !loading && (
                        <Text style={styles.instructionText}>
                            {isScanning ? 'Đang dò tìm hiện vật xung quanh...' : 'Hãy nhấn "Bắt đầu tham quan"'}
                        </Text>
                    )
                )}
            </View>

            <TouchableOpacity 
                style={[styles.button, isScanning ? styles.buttonStop : styles.buttonStart]} 
                onPress={isScanning ? stopScan : startScan}
            >
                <Text style={styles.buttonText}>{isScanning ? 'Dừng tham quan' : 'Bắt đầu tham quan'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#F5F7FA', justifyContent: 'space-between', paddingBottom: 30 },
    headerTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#2C3E50' },
    button: { padding: 18, borderRadius: 12, alignItems: 'center' },
    buttonStart: { backgroundColor: '#27AE60' },
    buttonStop: { backgroundColor: '#E74C3C' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    infoContainer: { flex: 1, justifyContent: 'center' },
    card: { padding: 20, borderRadius: 12, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    artifactTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#34495E' },
    location: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2980B9' },
    description: { fontSize: 16, lineHeight: 24, color: '#2C3E50' },
    instructionText: { textAlign: 'center', fontSize: 18, color: '#95A5A6' },
});