import React from "react";

import {

    Card,

    List,

    Badge,

    Progress,

} from "antd";

const SystemStatus: React.FC = () => {

    const data = [

        {
            title: "Backend Server",
            status: "success",
            text: "Online",
        },

        {
            title: "Database",
            status: "success",
            text: "Connected",
        },

        {
            title: "Beacon Devices",
            status: "processing",
            text: "18 Online",
        },

    ];

    return (

        <Card title="Trạng thái hệ thống">

            <List

                dataSource={data}

                renderItem={(item) => (

                    <List.Item>

                        <List.Item.Meta

                            title={item.title}

                            description={

                                <Badge

                                    status={item.status as any}

                                    text={item.text}

                                />

                            }

                        />

                    </List.Item>

                )}

            />

            <div style={{ marginTop: 20 }}>

                <p><b>Dung lượng lưu trữ</b></p>

                <Progress percent={72} />

            </div>

        </Card>

    );

};

export default SystemStatus;