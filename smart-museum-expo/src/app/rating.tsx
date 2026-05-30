import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RatingScreen() {
    const [rating, setRating] = useState<number>(0);
    const [showThanks, setShowThanks] = useState<boolean>(false);
    
    // Dùng useRef để lưu ID của bộ đếm giờ, giúp hủy bộ đếm cũ nếu người dùng bấm lại
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mảng 5 phần tử đại diện cho 5 ngôi sao
    const stars = [1, 2, 3, 4, 5];

    const handleRate = (selectedStar: number) => {
        setRating(selectedStar);
        setShowThanks(true);

        // Xóa bộ đếm giờ cũ (nếu có) để thời gian 10s luôn đếm lại từ đầu mỗi lần bấm
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Đặt bộ đếm giờ mới: 10000ms = 10 giây
        timeoutRef.current = setTimeout(() => {
            setShowThanks(false);
        }, 10000);
    };

    // Cleanup function: Xóa bộ đếm nếu người dùng chuyển sang tab khác trước khi hết 10s
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Đánh giá trải nghiệm</Text>
            
            <Text style={styles.subtitle}>
                Bạn cảm thấy hệ thống dẫn đường và thuyết minh của bảo tàng như thế nào?
            </Text>

            {/* Khu vực hiển thị 5 ngôi sao */}
            <View style={styles.starsContainer}>
                {stars.map((star) => (
                    <TouchableOpacity 
                        key={star} 
                        onPress={() => handleRate(star)}
                        activeOpacity={0.7}
                    >
                        <Ionicons 
                            // Nếu sao hiện tại nhỏ hơn hoặc bằng số điểm đã đánh giá -> sao đặc, ngược lại -> sao viền
                            name={star <= rating ? "star" : "star-outline"} 
                            size={45} 
                            color={star <= rating ? "#F1C40F" : "#BDC3C7"} 
                            style={styles.starIcon}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Lời cảm ơn chỉ hiện khi showThanks = true */}
            {showThanks && (
                <View style={styles.thanksContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
                    <Text style={styles.thanksText}>
                        Cảm ơn bạn đã đánh giá {rating} sao!
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 80,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    thanksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F8F5',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#A9DFBF',
    },
    thanksText: {
        fontSize: 16,
        color: '#27AE60',
        fontWeight: '600',
        marginLeft: 8,
    }
});