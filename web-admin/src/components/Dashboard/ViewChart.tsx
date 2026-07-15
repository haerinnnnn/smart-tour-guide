import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { Spin, Empty } from "antd";

interface MonthlyView {
    month: string;
    total: number;
}

const ViewChart: React.FC = () => {
    const [data, setData] = useState<MonthlyView[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:3000/api/dashboard/monthly-views"
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

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 60 }}>
                <Spin />
            </div>
        );
    }

    if (data.length === 0 || data.every((d) => d.total === 0)) {
        return <Empty description="Chưa có lượt xem nào" />;
    }

    const config = {
        data,
        xField: "month",
        yField: "total",
        height: 280,
        smooth: true,
        point: { size: 4, shape: "circle" },
        color: "#1677ff",
        xAxis: {
            title: { text: "Tháng" },
        },
        yAxis: {
            title: { text: "Lượt xem" },
        },
    };

    return <Line {...config} />;
};

export default ViewChart;
