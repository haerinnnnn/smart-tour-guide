import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Image,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // Đảm bảo URL này khớp với port Backend của bạn
const ARTIFACTS_URL = `${API_BASE}/api/artifacts`;
const BEACONS_URL = `${API_BASE}/api/beacons`;
const UPLOAD_URL = `${ARTIFACTS_URL}/upload`;

interface Artifact {
    id: number;
    beacon_id: number | null;
    title: string;
    author: string;
    description: string;
    image_url: string | null;
    audio_url: string | null;
    location_name?: string;
}

interface Beacon {
    id: number;
    uuid: string;
    major: number;
    minor: number;
    location_name: string;
}

const { TextArea } = Input;

const ArtifactManagement: React.FC = () => {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [beacons, setBeacons] = useState<Beacon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [uploadingAudio, setUploadingAudio] = useState<boolean>(false);
    const [form] = Form.useForm();

    // Lấy danh sách Hiện vật từ API
    const fetchArtifacts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(ARTIFACTS_URL);
            if (response.data.success) {
                setArtifacts(response.data.data);
            }
        } catch (error) {
            console.error('API Error:', error);
            message.error('Lỗi khi tải danh sách Hiện vật');
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách Beacon để hiển thị trong dropdown gắn vị trí
    const fetchBeacons = async () => {
        try {
            const response = await axios.get(BEACONS_URL);
            if (response.data.success) {
                setBeacons(response.data.data);
            }
        } catch (error) {
            console.error('API Error:', error);
            message.error('Lỗi khi tải danh sách Beacon');
        }
    };

    useEffect(() => {
        // Sử dụng setTimeout để đẩy lệnh gọi ra khỏi luồng đồng bộ của useEffect
        const timer = setTimeout(() => {
            fetchArtifacts();
            fetchBeacons();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Xóa 1 Hiện vật
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${ARTIFACTS_URL}/${id}`);
            message.success('Xóa hiện vật thành công');
            fetchArtifacts();
        } catch (error) {
            console.error('Delete Error:', error);
            message.error('Lỗi khi xóa hiện vật');
        }
    };

    // Mở modal Thêm mới
    const handleAdd = () => {
        setEditingArtifact(null);
        setImageUrl(null);
        setAudioUrl(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // Mở modal Cập nhật
    const handleEdit = (record: Artifact) => {
        setEditingArtifact(record);
        setImageUrl(record.image_url);
        setAudioUrl(record.audio_url);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    // Xử lý sự kiện "Lưu" trong Modal (áp dụng chung cho Thêm / Sửa)
    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                const payload = { ...values, image_url: imageUrl, audio_url: audioUrl };
                if (editingArtifact) {
                    await axios.put(`${ARTIFACTS_URL}/${editingArtifact.id}`, payload);
                    message.success('Cập nhật hiện vật thành công');
                } else {
                    await axios.post(ARTIFACTS_URL, payload);
                    message.success('Thêm hiện vật thành công');
                }
                setIsModalVisible(false);
                fetchArtifacts();
            } catch (error) {
                console.error('Submit Error:', error);
                message.error('Có lỗi xảy ra khi lưu thông tin');
            }
        });
    };

    // Upload ảnh: tự gọi API /api/artifacts/upload, lưu URL trả về vào state
    const handleImageUpload: UploadProps['customRequest'] = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file as File);

        setUploadingImage(true);
        try {
            const response = await axios.post(UPLOAD_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                setImageUrl(response.data.url);
                message.success('Tải ảnh lên thành công');
                onSuccess?.(response.data);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            message.error('Lỗi khi tải ảnh lên');
            onError?.(error as Error);
        } finally {
            setUploadingImage(false);
        }
    };

    // Upload audio: tương tự ảnh nhưng lưu vào audioUrl
    const handleAudioUpload: UploadProps['customRequest'] = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file as File);

        setUploadingAudio(true);
        try {
            const response = await axios.post(UPLOAD_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                setAudioUrl(response.data.url);
                message.success('Tải file âm thanh lên thành công');
                onSuccess?.(response.data);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            message.error('Lỗi khi tải file âm thanh lên');
            onError?.(error as Error);
        } finally {
            setUploadingAudio(false);
        }
    };

    // Cấu hình các cột của bảng dữ liệu
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        {
            title: 'Ảnh',
            dataIndex: 'image_url',
            key: 'image_url',
            width: 80,
            render: (url: string | null) =>
                url ? (
                    <Image src={`${API_BASE}${url}`} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">
                        N/A
                    </div>
                ),
        },
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Vị trí gắn Beacon', dataIndex: 'location_name', key: 'location_name', render: (v: string) => v || '—' },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_text: unknown, record: Artifact) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Quản lý Hiện vật</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm mới
                </Button>
            </div>

            <Table columns={columns} dataSource={artifacts} rowKey="id" loading={loading} pagination={{ pageSize: 8 }} />

            <Modal
                title={editingArtifact ? 'Cập nhật Hiện vật' : 'Thêm mới Hiện vật'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
                width={560}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="VD: Thiếu nữ bên hoa huệ" />
                    </Form.Item>

                    <Form.Item name="author" label="Tác giả">
                        <Input placeholder="VD: Tô Ngọc Vân (mặc định: Ẩn danh)" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <TextArea rows={4} placeholder="Bài viết thuyết minh chi tiết về hiện vật..." />
                    </Form.Item>

                    <Form.Item name="beacon_id" label="Gắn với Beacon (vị trí)">
                        <Select
                            allowClear
                            placeholder="Chọn vị trí Beacon"
                            options={beacons.map((b) => ({
                                value: b.id,
                                label: `${b.location_name} (Major ${b.major} / Minor ${b.minor})`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Hình ảnh">
                        <Upload customRequest={handleImageUpload} showUploadList={false} accept="image/*">
                            <Button icon={<UploadOutlined />} loading={uploadingImage}>
                                {imageUrl ? 'Đổi ảnh khác' : 'Tải ảnh lên'}
                            </Button>
                        </Upload>
                        {imageUrl && (
                            <div className="mt-2">
                                <Image src={`${API_BASE}${imageUrl}`} width={120} style={{ borderRadius: 8 }} />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item label="Âm thanh thuyết minh (MP3)">
                        <Upload customRequest={handleAudioUpload} showUploadList={false} accept="audio/*">
                            <Button icon={<UploadOutlined />} loading={uploadingAudio}>
                                {audioUrl ? 'Đổi file khác' : 'Tải file âm thanh lên'}
                            </Button>
                        </Upload>
                        {audioUrl && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <PlayCircleOutlined />
                                <audio controls src={`${API_BASE}${audioUrl}`} style={{ height: 32 }} />
                            </div>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ArtifactManagement;
