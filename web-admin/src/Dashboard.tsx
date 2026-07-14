import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, message, Skeleton } from 'antd';
import { WifiOutlined, PictureOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/artifacts/stats'; // Đảm bảo URL này khớp với port Backend của bạn

interface Stats {
    totalBeacons: number;
    totalArtifacts: number;
    totalVisits: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Lấy số liệu thống kê tổng quan từ API
    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('API Error:', error);
            message.error('Lỗi khi tải số liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Sử dụng setTimeout để đẩy lệnh gọi ra khỏi luồng đồng bộ của useEffect
        const timer = setTimeout(() => fetchStats(), 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thống kê tổng quan</h2>

            {loading ? (
                <Row gutter={16}>
                    {[1, 2, 3].map((key) => (
                        <Col span={8} key={key}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 1 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số Beacon"
                                value={stats?.totalBeacons ?? 0}
                                prefix={<WifiOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số Hiện vật"
                                value={stats?.totalArtifacts ?? 0}
                                prefix={<PictureOutlined />}
                                valueStyle={{ color: '#27AE60' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số lượt xem"
                                value={stats?.totalVisits ?? 0}
                                prefix={<EyeOutlined />}
                                valueStyle={{ color: '#E67E22' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default Dashboard;
