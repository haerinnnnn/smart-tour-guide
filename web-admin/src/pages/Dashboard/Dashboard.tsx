import React, { useEffect, useState } from "react";

import {
    Row,
    Col,
    Typography,
    Card,
} from "antd";

import {
    AppstoreOutlined,
    WifiOutlined,
    EyeOutlined,
    UserOutlined,
} from "@ant-design/icons";

import StatCard from "../../components/Dashboard/StatCard";
import ViewChart from "../../components/Dashboard/ViewChart";
import TopArtifacts from "../../components/Dashboard/TopArtifacts";
import RecentActivities from "../../components/Dashboard/RecentActivities";

const { Title } = Typography;

const API = "http://localhost:3000/api/dashboard";

interface DashboardStats {
    totalArtifacts: number;
    totalBeacons: number;
    totalVisits: number;
    totalUsers: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalArtifacts: 0,
        totalBeacons: 0,
        totalVisits: 0,
        totalUsers: 0,
    });

    const loadStats = async () => {
        try {
            const response = await fetch(`${API}/stats`);
            const result = await response.json();
            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <>
            <Title level={2}>
                Dashboard
            </Title>

            {/* ===== STATISTICS ===== */}

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Hiện vật"
                        value={stats.totalArtifacts}
                        color="#1677ff"
                        icon={<AppstoreOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Beacon"
                        value={stats.totalBeacons}
                        color="#52c41a"
                        icon={<WifiOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Lượt xem"
                        value={stats.totalVisits}
                        color="#fa8c16"
                        icon={<EyeOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Admin"
                        value={stats.totalUsers}
                        color="#722ed1"
                        icon={<UserOutlined />}
                    />
                </Col>
            </Row>

            {/* ===== CHART ===== */}

            <Row
                gutter={[16, 16]}
                style={{
                    marginTop: 20,
                }}
            >
                <Col span={24}>
                    <Card title="Thống kê lượt xem theo tháng">
                        <ViewChart />
                    </Card>
                </Col>
            </Row>

            {/* ===== TABLE ===== */}

            <Row
                gutter={[16, 16]}
                style={{
                    marginTop: 20,
                }}
            >
                <Col xs={24} lg={14}>
                    <TopArtifacts />
                </Col>

                <Col xs={24} lg={10}>
                    <RecentActivities />
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;
