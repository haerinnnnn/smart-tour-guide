import React from "react";
import {
    Table,
    Button,
    Image,
    Space,
    Popconfirm,
    Tag,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

interface Artifact {
    id: number;
    beacon_id: number | null;

    title: string;
    author: string;
    description: string;

    image_url: string;
    audio_url: string;

    location_name?: string;

    uuid?: string;
    major?: number;
    minor?: number;
}

interface Props {
    data: Artifact[];
    loading: boolean;
    onEdit: (artifact: Artifact) => void;
    onDelete: (id: number) => void;
}
const getFileUrl = (url?: string) => {
    if (!url) return "";

    // Nếu là URL đầy đủ
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Nếu là file upload trong backend
    return `http://localhost:3000${url}`;
};

const ArtifactTable: React.FC<Props> = ({
    data,
    loading,
    onEdit,
    onDelete,
}) => {
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 70,
            align: "center" as const,
        },

        {
            title: "Ảnh",
            dataIndex: "image_url",
            width: 110,
            align: "center" as const,

            render: (url: string) =>
                url ? (
                    <Image
                        width={70}
                        height={70}
                        preview
                        style={{
                            objectFit: "cover",
                            borderRadius: 6,
                        }}
                        src={getFileUrl(url)}
                        fallback="https://placehold.co/70x70?text=No+Image"
                    />
                ) : (
                    "-"
                ),
        },

        {
            title: "Tên hiện vật",
            dataIndex: "title",
        },

        {
            title: "Tác giả",
            dataIndex: "author",
            width: 180,
        },

        {
            title: "Beacon",
            width: 220,

            render: (_: any, record: Artifact) =>
                record.location_name ? (
                    <Space direction="vertical" size={0}>
                        <Tag color="blue">
                            {record.location_name}
                        </Tag>

                        <small>
                            Major: {record.major} | Minor: {record.minor}
                        </small>
                    </Space>
                ) : (
                    <Tag color="red">
                        Chưa gắn Beacon
                    </Tag>
                ),
        },

        {
            title: "Âm thanh",
            dataIndex: "audio_url",
            width: 250,

            render: (url: string) =>
                url ? (
                    <audio
                        controls
                        style={{
                            width: 180,
                        }}
                    >
                        <source
                            src={`http://localhost:3000${url}`}
                        />
                    </audio>
                ) : (
                    "-"
                ),
        },

        {
            title: "Thao tác",
            width: 170,
            align: "center" as const,

            render: (_: any, record: Artifact) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        Sửa
                    </Button>

                    <Popconfirm
                        title="Xóa hiện vật?"
                        description="Bạn có chắc chắn muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => onDelete(record.id)}
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

export default ArtifactTable;