import React from "react";

import {
    Table,
    Tag,
    Space,
    Button,
    Popconfirm,
    message,
} from "antd";

import {
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

interface Props {

    data: Beacon[];

    loading: boolean;

    onEdit: (beacon: Beacon) => void;

    onDelete: (id: number) => void;

}

const API = "http://localhost:3000/api/beacons";

const BeaconTable: React.FC<Props> = ({
    loading,
    data,
    onEdit,
    onDelete,
}) => {

    const deleteBeacon = async (id: number) => {

        try {

            const response = await fetch(`${API}/${id}`, {

                method: "DELETE",

            });

            const result = await response.json();

            if (result.success) {

                message.success("Đã xóa Beacon");

                onDelete();

            } else {

                message.error(result.message);

            }

        } catch {

            message.error("Không thể kết nối Server");

        }

    };

    const columns = [

        {
            title: "ID",
            dataIndex: "id",
            width: 80,
            sorter: (a: any, b: any) => a.id - b.id,
        },

        {
            title: "UUID",
            dataIndex: "uuid",
        },

        {
            title: "Major",
            dataIndex: "major",
            sorter: (a: any, b: any) => a.major - b.major,
        },

        {
            title: "Minor",
            dataIndex: "minor",
            sorter: (a: any, b: any) => a.minor - b.minor,
        },

        {
            title: "Khu vực",
            dataIndex: "location_name",
        },

        {
            title: "Trạng thái",

            render: (_: any, record: any) =>

                record.is_active ? (

                    <Tag color="green">
                        Online
                    </Tag>

                ) : (

                    <Tag color="red">
                        Offline
                    </Tag>

                ),

        },

        {
            title: "Thao tác",

            width: 180,

            render: (_: any, record: any) => (

                <Space>

                    <Button

                        icon={<EditOutlined />}

                        type="primary"

                        onClick={() => onEdit(record)}

                    >
                        Sửa
                    </Button>

                    <Popconfirm

                        title="Xóa Beacon?"

                        description="Bạn chắc chắn muốn xóa Beacon này?"

                        okText="Có"

                        cancelText="Không"

                        onConfirm={() =>
                            deleteBeacon(record.id)
                        }

                    >

                        <Button

                            danger

                            icon={<DeleteOutlined />}

                        >
                            Xóa
                        </Button>

                    </Popconfirm>

                </Space>

            ),

        },

    ];

    return (

        <Table

            rowKey="id"

            loading={loading}

            columns={columns}

            dataSource={data}

            bordered

            pagination={{

                pageSize: 8,

                showSizeChanger: false,

            }}

        />

    );

};

export default BeaconTable;