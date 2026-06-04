import { useState, useEffect, useRef, useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid, Permission } from 'react-native';

const manager = new BleManager();
const FILTER_N = 5; // Hằng số N cho thuật toán Moving Average

export const useBleScanner = () => {
    const [nearestBeacon, setNearestBeacon] = useState<{uuid: string, major: number, minor: number, name?: string} | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    
    const rssiHistory = useRef<Record<string, number[]>>({});
    // Dùng useRef để lưu Từ điển Beacon nhằm tránh kẹt Closure trong hàm callback quét
    const beaconDictionary = useRef<Record<string, any>>({}); 

    // 1. KẾT NỐI BACKEND: Tải danh sách Beacon khi App vừa khởi động
    useEffect(() => {
        // ⚠️ QUAN TRỌNG: Sửa IP này thành IPv4 máy tính của bạn (Mở cmd -> gõ ipconfig)
        // Tuyệt đối không dùng 'localhost' vì điện thoại sẽ không hiểu
        const API_URL = 'http://192.168.1.221:3000/api/beacons'; 

        fetch(API_URL)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    beaconDictionary.current = json.data;
                    console.log("📚 Đã tải Từ điển Beacon từ Server, gồm các MAC:", Object.keys(json.data));
                }
            })
            .catch(err => console.log("❌ Lỗi tải Từ điển Beacon (nhớ bật Node.js và check IP):", err));

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
        if (!hasPermission) return;

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
                // 1. Ép toàn bộ MAC về chữ IN HOA để tra từ điển không bao giờ trượt
                const scannedMac = device.id.toUpperCase();
                const currentRssi = device.rssi || -100;

                // 2. BẬT RADAR: Chỉ in ra những sóng đang ở rất gần (RSSI > -75) 
                if (currentRssi > -75) {
                    //console.log(`📡 Radar: MAC: ${scannedMac} | Tên: ${device.name || "Bị ẩn"} | RSSI: ${currentRssi}`);
                }

                // 3. TÌM KIẾM TRONG TỪ ĐIỂN
                const targetBeacon = beaconDictionary.current[scannedMac];
                
                if (targetBeacon) {
                    // Chạy thuật toán Moving Average để mượt sóng
                    if (!rssiHistory.current[scannedMac]) rssiHistory.current[scannedMac] = [];
                    rssiHistory.current[scannedMac].push(currentRssi);
                    if (rssiHistory.current[scannedMac].length > FILTER_N) {
                        rssiHistory.current[scannedMac].shift();
                    }

                    const sum = rssiHistory.current[scannedMac].reduce((a, b) => a + b, 0);
                    const smoothRssi = sum / rssiHistory.current[scannedMac].length;

                    //console.log(`🔥 ĐÃ BẮT ĐƯỢC MẠCH CỦA MÌNH: ${targetBeacon.name} | MAC: ${scannedMac} | Sóng RSSI: ${smoothRssi.toFixed(1)}`);

                    // 4. Kích hoạt hiển thị nếu tiến lại gần mạch ESP32 (Sóng > -65 dBm)
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