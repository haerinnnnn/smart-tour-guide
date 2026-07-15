import React, { useEffect, useState } from "react";
import { Card, Typography, Button, message, Input, Space } from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

import ArtifactTable from "../../components/Artifacts/ArtifactTable";
import ArtifactModal from "../../components/Artifacts/ArtifactModal";

const { Title } = Typography;

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

const ArtifactManagement: React.FC = () => {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingArtifact, setEditingArtifact] =
        useState<Artifact | null>(null);

    const [searchText, setSearchText] = useState("");

    const loadArtifacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:3000/api/artifacts"
            );
            const result = await response.json();
            if (result.success) {
                setArtifacts(result.data);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể tải danh sách hiện vật");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtifacts();
    }, []);

    const handleAdd = () => {
        setEditingArtifact(null);
        setModalOpen(true);
    };

    const handleEdit = (artifact: Artifact) => {
        setEditingArtifact(artifact);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/artifacts/${id}`,
                {
                    method: "DELETE",
                }
            );
            const result = await response.json();
            if (result.success) {
                message.success("Xóa hiện vật thành công");
                loadArtifacts();
            } else {
                message.error(result.message);
            }
        } catch (error) {
            console.error(error);
            message.error("Không thể xóa hiện vật");
        }
    };

    const filteredArtifacts = artifacts.filter((artifact) =>
        artifact.title
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    return (
        <Card>
            <Space
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    Quản lý Hiện vật
                </Title>

                <Space>
                    <Input
                        style={{ width: 250 }}
                        placeholder="Tìm hiện vật..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadArtifacts}
                    >
                        Làm mới
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Thêm hiện vật
                    </Button>
                </Space>
            </Space>

            <ArtifactTable
                data={filteredArtifacts}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ArtifactModal
                open={modalOpen}
                artifact={editingArtifact}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingArtifact(null);
                }}
                onSuccess={() => {
                    setModalOpen(false);
                    setEditingArtifact(null);
                    loadArtifacts();
                }}
            />
        </Card>
    );
};

export default ArtifactManagement;