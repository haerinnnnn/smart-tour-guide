import React from 'react';
import { View, StyleSheet, Image, Text, StatusBar, Platform } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
// 1. Import Global Store (để lấy thông tin định vị từ file quét BLE)
import { useBleStore } from '../store/useBleStore'; 

// 2. TẠO TỪ ĐIỂN ẢNH LOCAL
// Cấu trúc key: 'major_minor'
const LOCAL_MAPS: Record<string, any> = {
    '1_1': require('../../assets/images/minor1major1.png'), 
    '1_2': require('../../assets/images/minor2major1.png'), 
    '2_1': require('../../assets/images/minor1major2.png'), 
    'default': require('../../assets/images/Fullmap.png')     
};
export default function MapScreen() {
    // Kéo thông tin mạch Beacon gần nhất từ Store về
    const nearestBeacon = useBleStore(state => state.nearestBeacon);

    // 3. THUẬT TOÁN ĐỔI ẢNH BẢN ĐỒ TỰ ĐỘNG
    let mapSource = LOCAL_MAPS['default']; 
    
    if (nearestBeacon) {
        // Tạo key truy vấn (ví dụ: "1_1")
        const beaconKey = `${nearestBeacon.major}_${nearestBeacon.minor}`;
        
        // Kiểm tra xem trong từ điển có ảnh khớp với key này không
        if (LOCAL_MAPS[beaconKey]) {
            mapSource = LOCAL_MAPS[beaconKey];
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>BẢN ĐỒ BẢO TÀNG</Text>
                
                {/* HIỂN THỊ TRẠNG THÁI VỊ TRÍ */}
                {nearestBeacon ? (
                    <Text style={styles.activeLocation}>📍 Bạn đang ở: {nearestBeacon.name || 'Khu vực trưng bày'}</Text>
                ) : (
                    <Text style={styles.inactiveLocation}>Đang chờ tín hiệu định vị...</Text>
                )}
            </View>
            
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
                        source={mapSource} 
                        style={styles.mapImage} 
                    />
                </ReactNativeZoomableView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#111',
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 
    },
    header: { 
        paddingVertical: 18, 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#222' 
    },
    headerTitle: { 
        fontSize: 18, 
        fontWeight: '800', 
        color: '#FFF', 
        letterSpacing: 2 
    },
    activeLocation: { 
        fontSize: 14, 
        color: '#27AE60', // Màu xanh lá nổi bật khi nhận diện thành công
        marginTop: 8, 
        fontWeight: '600' 
    },
    inactiveLocation: { 
        fontSize: 14, 
        color: '#888', // Màu xám chìm khi chưa có tín hiệu
        marginTop: 8, 
        fontStyle: 'italic' 
    },
    mapContainer: { 
        flex: 1, 
        backgroundColor: '#000', 
    },
    zoomableView: { 
        flex: 1 
    },
    mapImage: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'contain' 
    },
});