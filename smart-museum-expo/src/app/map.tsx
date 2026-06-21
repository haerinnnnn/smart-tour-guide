import React from 'react';
import { View, StyleSheet, Image, Text, StatusBar, Platform } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>BẢN ĐỒ BẢO TÀNG</Text>
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
                        source={require('../../assets/images/map.jpg')} 
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
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