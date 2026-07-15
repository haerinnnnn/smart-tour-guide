import React, { useEffect, useState } from "react";
import { Card, Timeline, Spin, Empty, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Activity {
    id: number;
    created_at: string;
    artifact_id: number;
    title: string;
    location_name: string | null;
}

const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const RecentActivities: React.FC = () => {
    const [data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:3000/api/dashboard/recent-activities"
            );
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Card title="Hoạt động gần đây">
            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin />
                </div>
            ) : data.length === 0 ? (
                <Empty description="Chưa có hoạt động nào" />
            ) : (
                <Timeline
                    items={data.map((item) => ({
                        dot: <EyeOutlined style={{ color: "#1677ff" }} />,
                        children: (
                            <>
                                <Text strong>{item.title}</Text>
                                <br />
                                <Text type="secondary">
                                    {item.location_name || "Không rõ vị trí"} ·{" "}
                                    {formatTime(item.created_at)}
                                </Text>
                            </>
                        ),
                    }))}
                />
            )}
        </Card>
    );
};

export default RecentActivities;
