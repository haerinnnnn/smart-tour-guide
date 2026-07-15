import React from "react";
import { Column } from "@ant-design/plots";

const ViewChart: React.FC = () => {

    const data = [
        { month: "Jan", views: 120 },
        { month: "Feb", views: 165 },
        { month: "Mar", views: 210 },
        { month: "Apr", views: 180 },
        { month: "May", views: 250 },
        { month: "Jun", views: 310 },
        { month: "Jul", views: 280 },
        { month: "Aug", views: 340 },
        { month: "Sep", views: 295 },
        { month: "Oct", views: 360 },
        { month: "Nov", views: 420 },
        { month: "Dec", views: 500 },
    ];

    return (

        <Column

            data={data}

            xField="month"

            yField="views"

            height={320}

            columnStyle={{
                radius: [6, 6, 0, 0],
            }}

            label={{
                text: "views",
                position: "top",
                style: {
                    fill: "#666",
                },
            }}

            axis={{
                y: {
                    title: "Lượt xem",
                },
                x: {
                    title: "Tháng",
                },
            }}

        />

    );

};

export default ViewChart;