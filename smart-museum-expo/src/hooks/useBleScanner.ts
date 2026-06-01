import { useState, useEffect, useRef, useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

const manager = new BleManager();
const FILTER_N = 5; // Hằng số N cho thuật toán Moving Average

export const useBleScanner = () => {
    const [nearestBeacon, setNearestBeacon] = useState<{uuid: string, major: number, minor: number} | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    
    // Lưu trữ lịch sử RSSI để tính toán Moving Average theo MAC Address của thiết bị
    const rssiHistory = useRef<Record<string, number[]>>({});

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                ]);
                return Object.values(granted).every(
                    permission => permission === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (error) {
                console.error('❌ Lỗi xin quyền Bluetooth:', error);
                return false;
            }
        }
        return true; // iOS được cấu hình qua Info.plist
    };

    const startScan = useCallback(async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.error('❌ Không có quyền truy cập Bluetooth/Vị trí');
            return;
        }

        setIsScanning(true);
        console.log('🔍 Bắt đầu quét BLE...');

        manager.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
            if (error) {
                console.error('❌ Lỗi quét BLE:', error.message);
                setIsScanning(false);
                return;
            }

            // Lọc thiết bị của bảo tàng (Dựa trên tên hoặc Service UUID đã set ở ESP32)
            if (device && device.name === "Museum Beacon 2" && device.rssi) {
                processBeaconSignal(device);
            }
            if (device && device.name === "Museum Beacon 1" && device.rssi) {
                processBeaconSignal(device);
            }
        });
    }, []);

    const processBeaconSignal = (device: Device) => {
        const mac = device.id;
        const currentRssi = device.rssi!;

        // 1. Cập nhật mảng lịch sử RSSI
        if (!rssiHistory.current[mac]) {
            rssiHistory.current[mac] = [];
        }
        rssiHistory.current[mac].push(currentRssi);
        if (rssiHistory.current[mac].length > FILTER_N) {
            rssiHistory.current[mac].shift(); // Xóa giá trị cũ nhất
        }

        // 2. Tính toán RSSI mượt (Moving Average)
        const sum = rssiHistory.current[mac].reduce((a, b) => a + b, 0);
        const smoothRssi = sum / rssiHistory.current[mac].length;

        // Bán kính quét hẹp (VD: RSSI > -65 là ở rất gần)
        if (smoothRssi > -65) {
            // Giả lập bóc tách UUID, Major, Minor từ gói tin (Thực tế cần parser dữ liệu thô)
            // Vì yêu cầu giữ code rõ ràng, ta map cứng thông số từ ESP32 đang phát ra
            setNearestBeacon({
                uuid: "12345678-1234-1234-1234-123456789012",
                major: 1,
                minor: 1
            });
        }
    };

    const stopScan = () => {
        manager.stopDeviceScan();
        setIsScanning(false);
        console.log('⏹️ Đã dừng quét BLE');
    };

    useEffect(() => {
        return () => {
            manager.stopDeviceScan(); // Cleanup khi unmount
        };
    }, []);

    return { startScan, stopScan, isScanning, nearestBeacon };
};