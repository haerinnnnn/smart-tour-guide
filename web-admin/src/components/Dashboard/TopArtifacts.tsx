import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Tag, Spin, Empty } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

interface TopArtifact {
    id: number;
    title: string;
    image_url: string | null;
    location_name: string | null;
    views: number;
}

const medalColors = ["#faad14", "#bfbfbf", "#d4824a"];

const TopArtifacts: React.FC = () => {
    const [data, setData] = useState<TopArtifact[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:3000/api/dashboard/top-artifacts"
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
        <Card title="Hiện vật được xem nhiều nhất">
            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin />
                </div>
            ) : data.length === 0 ? (
                <Empty description="Chưa có dữ liệu" />
            ) : (
                <List
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    item.image_url ? (
                                        <Avatar
                                            shape="square"
                                            size={48}
                                            src={`http://localhost:3000${item.image_url}`}
                                        />
                                    ) : (
                                        <Avatar
                                            shape="square"
                                            size={48}
                                            icon={<TrophyOutlined />}
                                            style={{
                                                backgroundColor:
                                                    medalColors[index] || "#f0f0f0",
                                            }}
                                        />
                                    )
                                }
                                title={item.title}
                                description={
                                    item.location_name || "Chưa gắn Beacon"
                                }
                            />
                            <Tag color="blue">{item.views} lượt xem</Tag>
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default TopArtifacts;
