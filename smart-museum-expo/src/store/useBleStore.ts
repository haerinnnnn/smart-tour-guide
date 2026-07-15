import { create } from 'zustand';

// Định nghĩa cấu trúc dữ liệu của một mạch Beacon
interface BeaconData {
    uuid: string;
    major: number;
    minor: number;
    name?: string;
}

// Định nghĩa kho lưu trữ
interface BleState {
    nearestBeacon: BeaconData | null;
    isScanning: boolean;
    setNearestBeacon: (beacon: BeaconData | null) => void;
    setIsScanning: (status: boolean) => void;
}

// Tạo kho lưu trữ
export const useBleStore = create<BleState>((set) => ({
    nearestBeacon: null,
    isScanning: false,
    setNearestBeacon: (beacon) => set({ nearestBeacon: beacon }),
    setIsScanning: (status) => set({ isScanning: status }),
}));