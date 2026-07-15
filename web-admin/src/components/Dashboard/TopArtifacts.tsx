import React from "react";
import { Card, Table, Tag } from "antd";

const TopArtifacts: React.FC = () => {

    const data = [

        {
            key: 1,
            title: "Trống đồng Đông Sơn",
            location: "Khu A",
            views: 520,
        },

        {
            key: 2,
            title: "Chuông đồng",
            location: "Khu B",
            views: 460,
        },

        {
            key: 3,
            title: "Tượng Phật",
            location: "Khu C",
            views: 390,
        },

        {
            key: 4,
            title: "Bia đá",
            location: "Khu D",
            views: 320,
        },

        {
            key: 5,
            title: "Bình gốm cổ",
            location: "Khu A",
            views: 280,
        },

    ];

    const columns = [

        {
            title: "Hiện vật",
            dataIndex: "title",
        },

        {
            title: "Khu vực",
            dataIndex: "location",

            render: (value: string) => (
                <Tag color="blue">
                    {value}
                </Tag>
            ),
        },

        {
            title: "Lượt xem",
            dataIndex: "views",

            sorter: (a: any, b: any) => a.views - b.views,
        },

    ];

    return (

        <Card title="Top hiện vật được xem nhiều">

            <Table

                columns={columns}

                dataSource={data}

                pagination={false}

                size="small"

            />

        </Card>

    );

};

export default TopArtifacts;