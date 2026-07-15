import React from "react";
import { Card, Timeline } from "antd";

const RecentActivities: React.FC = () => {

    return (

        <Card title="Hoạt động gần đây">

            <Timeline

                items={[

                    {
                        color: "green",
                        children: "09:10 - Admin thêm hiện vật Trống đồng Đông Sơn",
                    },

                    {
                        color: "blue",
                        children: "09:45 - Admin cập nhật Beacon số 12",
                    },

                    {
                        color: "orange",
                        children: "10:30 - Visitor quét Beacon tại Khu A",
                    },

                    {
                        color: "green",
                        children: "11:15 - Admin chỉnh sửa mô tả hiện vật",
                    },

                    {
                        color: "red",
                        children: "11:50 - Beacon số 03 mất kết nối",
                    },

                ]}

            />

        </Card>

    );

};

export default RecentActivities;