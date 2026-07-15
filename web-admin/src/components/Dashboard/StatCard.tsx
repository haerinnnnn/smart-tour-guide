import React from "react";
import { Card, Statistic } from "antd";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
}) => {
    return (
        <Card
            hoverable
            style={{
                borderRadius: 12,
                height: "100%",
            }}
        >
            <Statistic
                title={title}
                value={value}
                prefix={
                    <span
                        style={{
                            color,
                            fontSize: 24,
                            marginRight: 8,
                        }}
                    >
                        {icon}
                    </span>
                }
                styles={{
                    content: {
                        color,
                        fontWeight: "bold",
                    },
                }}
            />
        </Card>
    );
};

export default StatCard;