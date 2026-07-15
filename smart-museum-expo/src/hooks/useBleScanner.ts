import { useEffect, useRef, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid, Permission, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useBleStore } from '../store/useBleStore'; // Lấy kho dữ liệu chung ra dùng

const manager = new BleManager();
const FILTER_N = 5;

export const useBleScanner = () => {
    // Không dùng useState nữa, mà dùng hàm từ Store
    const nearestBeacon = useBleStore(state => state.nearestBeacon);
    const setNearestBeacon = useBleStore(state => state.setNearestBeacon);
    const isScanning = useBleStore(state => state.isScanning);
    const setIsScanning = useBleStore(state => state.setIsScanning);
    
    const rssiHistory = useRef<Record<string, number[]>>({});
    const beaconDictionary = useRef<Record<string, any>>({}); 

    // 1. Tải Từ điển Beacon từ Server
    useEffect(() => {
        const hostUri = Constants.expoConfig?.hostUri;
        const SERVER_IP = hostUri ? hostUri.split(':')[0] : '192.168.1.221';
        const API_URL = `http://${SERVER_IP}:3000/api/beacons/dictionary`; 

        fetch(API_URL)
            .then(res => res.json())
            .then(json => {
                if (json.success) beaconDictionary.current = json.data;
            })
            .catch(err => console.log("❌ Lỗi tải Từ điển:", err.message));

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
                return Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED);
            } catch (error) { return false; }
        }
        return true; 
    };

    const startScan = useCallback(async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            Alert.alert("Lỗi quyền", "Bạn cần cấp quyền Bluetooth và Vị trí.");
            return;
        }

        if (Platform.OS === 'android') {
            const btState = await manager.state();
            if (btState !== 'PoweredOn') {
                Alert.alert("Chưa bật Bluetooth", "Bạn hãy bật Bluetooth nhé!");
                setIsScanning(false);
                return;
            }
        }

        setIsScanning(true);
        manager.startDeviceScan(null, { allowDuplicates: true, scanMode: 2 }, (error, device) => {
            if (error) return;

            if (device && device.id) {
                const scannedMac = device.id.toUpperCase();
                const currentRssi = device.rssi || -100;
                const targetBeacon = beaconDictionary.current[scannedMac];
                
                if (targetBeacon) {
                    if (!rssiHistory.current[scannedMac]) rssiHistory.current[scannedMac] = [];
                    rssiHistory.current[scannedMac].push(currentRssi);
                    if (rssiHistory.current[scannedMac].length > FILTER_N) rssiHistory.current[scannedMac].shift();

                    const sum = rssiHistory.current[scannedMac].reduce((a, b) => a + b, 0);
                    const smoothRssi = sum / rssiHistory.current[scannedMac].length;

                    // Lọc nhiễu và chống Spam
                    if (smoothRssi > -65) {
                        const currentBeaconState = useBleStore.getState().nearestBeacon;
                        if (currentBeaconState?.uuid !== targetBeacon.uuid) {
                            setNearestBeacon({
                                uuid: targetBeacon.uuid,
                                major: targetBeacon.major,
                                minor: targetBeacon.minor,
                                name: targetBeacon.name
                            });
                        }
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
    };

    // Trả ra các biến để trang index.tsx vẫn hoạt động bình thường
    return { startScan, stopScan, isScanning, nearestBeacon };
};