import { useState, useEffect, useRef, useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid, Permission, Alert } from 'react-native';
import Constants from 'expo-constants';

const manager = new BleManager();
const FILTER_N = 5; // Hằng số N cho thuật toán Moving Average

export const useBleScanner = () => {
    const [nearestBeacon, setNearestBeacon] = useState<{uuid: string, major: number, minor: number, name?: string} | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    
    const rssiHistory = useRef<Record<string, number[]>>({});
    // Dùng useRef để lưu Từ điển Beacon nhằm tránh kẹt Closure trong hàm callback quét
    const beaconDictionary = useRef<Record<string, any>>({}); 
    useEffect(() => {
        const hostUri = Constants.expoConfig?.hostUri;
        const SERVER_IP = hostUri ? hostUri.split(':')[0] : '192.168.1.221';
        
        const API_URL = `http://${SERVER_IP}:3000/api/beacons`; 
        console.log("🔗 Đang tải Từ điển Beacon từ:", API_URL);

        fetch(API_URL)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    beaconDictionary.current = json.data;
                    console.log("✅ Đã tải thành công Từ điển Beacon!");
                }
            })
            .catch(err => console.log("❌ Lỗi tải Từ điển Beacon:", err.message));

        return () => { manager.stopDeviceScan(); };
    }, []);
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const permissionsToRequest: Permission[] = [];
                if (Platform.Version >= 31) {
                    permissionsToRequest.push(
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                } else {
                    permissionsToRequest.push(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                    );
                }
                
                const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);
                return Object.values(granted).every(
                    permission => permission === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (error) {
                console.error('❌ Lỗi xin quyền Bluetooth:', error);
                return false;
            }
        }
        return true; 
    };

    const startScan = useCallback(async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert("Lỗi quyền", "Bạn cần cấp quyền Bluetooth và Vị trí để tham quan bảo tàng.");
            return;
        }

        // =========================================================
        // KIỂM TRA VÀ YÊU CẦU BẬT BLUETOOTH (An toàn 100% trên Android)
        // =========================================================
        if (Platform.OS === 'android') {
            const btState = await manager.state();
            if (btState !== 'PoweredOn') {
                console.log('⚠️ Bluetooth đang tắt, hiển thị cảnh báo cho người dùng.');
                
                // Hiển thị thông báo trên màn hình điện thoại
                Alert.alert(
                    "Chưa bật Bluetooth ⚠️",
                    "Bạn hãy vuốt màn hình từ trên xuống và bật Bluetooth để hệ thống có thể định vị tác phẩm nhé!",
                    [
                        { text: "Đã hiểu", style: "default" }
                    ]
                );
                
                setIsScanning(false);
                return; // Lập tức dừng lại, không chạy lệnh quét (tránh lỗi ngầm)
            }
        }
        // =========================================================

        setIsScanning(true);
        console.log("🚀 FILE CHUẨN TRONG SRC/HOOKS ĐANG CHẠY!");
        console.log('🔍 Bắt đầu quét thiết bị dựa trên Từ điển Database...');
        
        // Thêm tham số scanMode: 2 (Low Latency) để ép Android không bóp băng thông Bluetooth
        manager.startDeviceScan(null, { allowDuplicates: true, scanMode: 2 }, (error, device) => {
            if (error) {
                console.log('❌ Lỗi quét từ Android:', error.message);
                return;
            }

            if (device && device.id) {
                const scannedMac = device.id.toUpperCase();
                const currentRssi = device.rssi || -100;
                
                const targetBeacon = beaconDictionary.current[scannedMac];
                
                if (targetBeacon) {
                    if (!rssiHistory.current[scannedMac]) rssiHistory.current[scannedMac] = [];
                    rssiHistory.current[scannedMac].push(currentRssi);
                    if (rssiHistory.current[scannedMac].length > FILTER_N) {
                        rssiHistory.current[scannedMac].shift();
                    }

                    const sum = rssiHistory.current[scannedMac].reduce((a, b) => a + b, 0);
                    const smoothRssi = sum / rssiHistory.current[scannedMac].length;

                    if (smoothRssi > -65) {
                        setNearestBeacon({
                            uuid: targetBeacon.uuid,
                            major: targetBeacon.major,
                            minor: targetBeacon.minor,
                            name: targetBeacon.name
                        });
                    }
                }
            }
        });
    }, []);

    const stopScan = () => {
        manager.stopDeviceScan();
        setIsScanning(false);
        setNearestBeacon(null); 
        rssiHistory.current = {};
        console.log('⏹️ Đã dừng quét BLE');
    };

    return { startScan, stopScan, isScanning, nearestBeacon };
};