import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Bản đồ bảo tàng</Text>
            <View style={styles.mapContainer}>
                <ReactNativeZoomableView
                    maxZoom={3}
                    minZoom={1}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    style={styles.zoomableView}
                >
                    <Image 
                        source={require('../../assets/images/map.jpg')} 
                        style={styles.mapImage} 
                    />
                </ReactNativeZoomableView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 50, paddingHorizontal: 15 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#2C3E50' },
    mapContainer: { flex: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: '#E0E0E0', marginBottom: 15, borderWidth: 1, borderColor: '#BDC3C7' },
    zoomableView: { flex: 1 },
    mapImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});