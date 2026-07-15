import React from "react";

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

import CategoryPie from "../../components/Dashboard/CategoryPie";

import TopArtifacts from "../../components/Dashboard/TopArtifacts";

import RecentActivities from "../../components/Dashboard/RecentActivities";

import SystemStatus from "../../components/Dashboard/SystemStatus";

const { Title } = Typography;

const Dashboard: React.FC = () => {
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
                        value={26}
                        color="#1677ff"
                        icon={<AppstoreOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Beacon"
                        value={18}
                        color="#52c41a"
                        icon={<WifiOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Lượt xem"
                        value={1258}
                        color="#fa8c16"
                        icon={<EyeOutlined />}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Admin"
                        value={2}
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
                <Col xs={24} lg={16}>
                    <Card title="Thống kê lượt xem theo tháng">
                        <ViewChart />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Phân loại hiện vật">
                        <CategoryPie />
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
                    <SystemStatus />
                </Col>
            </Row>

            {/* ===== ACTIVITIES ===== */}

            <Row
                style={{
                    marginTop: 20,
                }}
            >
                <Col span={24}>
                    <RecentActivities />
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;