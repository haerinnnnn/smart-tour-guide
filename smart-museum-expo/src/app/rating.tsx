import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RatingScreen() {
    const [rating, setRating] = useState<number>(0);
    const [showThanks, setShowThanks] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stars = [1, 2, 3, 4, 5];

    const handleRate = (selectedStar: number) => {
        setRating(selectedStar);
        setShowThanks(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowThanks(false), 10000);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111" />
            <View style={styles.content}>
                <Text style={styles.headerTitle}>ĐÁNH GIÁ TRẢI NGHIỆM</Text>
                <View style={styles.divider} />
                <Text style={styles.subtitle}>
                    Bạn cảm thấy hệ thống dẫn đường và thuyết minh của bảo tàng như thế nào?
                </Text>
                
                <View style={styles.starsContainer}>
                    {stars.map((star) => (
                        <TouchableOpacity 
                            key={star} 
                            onPress={() => handleRate(star)}
                            activeOpacity={0.7}
                        >
                            <Ionicons 
                                name={star <= rating ? "star" : "star-outline"} 
                                size={45} 
                                color={star <= rating ? "#FFF" : "#333"} 
                                style={styles.starIcon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                
                {showThanks && (
                    <View style={styles.thanksContainer}>
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        <Text style={styles.thanksText}>
                            Cảm ơn bạn đã đánh giá {rating} sao!
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    content: { flex: 1, paddingTop: 60, paddingHorizontal: 24, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', letterSpacing: 2, textAlign: 'center' },
    divider: { height: 1, width: '40%', backgroundColor: '#333', marginVertical: 20 },
    subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40, lineHeight: 26 },
    starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
    starIcon: { marginHorizontal: 8 },
    thanksContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: '#444' },
    thanksText: { fontSize: 15, color: '#FFF', fontWeight: '600', marginLeft: 10, letterSpacing: 0.5 }
});