import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const ARTIFACT_API_URL = 'http://localhost:3000/api/artifacts';
const BEACON_API_URL = 'http://localhost:3000/api/beacons';

interface Artifact {
  id: number;
  beacon_id: number | null;
  title: string;
  author: string;
  description: string;
  image_url: string;
  audio_url: string;
  location_name?: string; 
}

interface Beacon {
  id: number;
  major: number;
  minor: number;
  location_name: string;
}

const ArtifactManagement: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [beacons, setBeacons] = useState<Beacon[]>([]); // Danh sách thiết bị để gán
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [form] = Form.useForm();

  // Tải danh sách Hiện vật và Beacon
  const fetchData = async () => {
    setLoading(true);
    try {
      const [artifactRes, beaconRes] = await Promise.all([
        axios.get(ARTIFACT_API_URL),
        axios.get(BEACON_API_URL)
      ]);
      
      if (artifactRes.data.success) setArtifacts(artifactRes.data.data);
      if (beaconRes.data.success) setBeacons(beaconRes.data.data);
    } catch (error) {
      console.error('API Error:', error);
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${ARTIFACT_API_URL}/${id}`);
      message.success('Xóa hiện vật thành công');
      fetchData();
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Lỗi khi xóa hiện vật');
    }
  };

  const handleAdd = () => {
    setEditingArtifact(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Artifact) => {
    setEditingArtifact(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingArtifact) {
          await axios.put(`${ARTIFACT_API_URL}/${editingArtifact.id}`, values);
          message.success('Cập nhật hiện vật thành công');
        } else {
          await axios.post(ARTIFACT_API_URL, values);
          message.success('Thêm hiện vật thành công');
        }
        setIsModalVisible(false);
        fetchData();
      } catch (error) {
        console.error('Submit Error:', error);
        message.error('Có lỗi xảy ra khi lưu thông tin');
      }
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Hình ảnh', 
      key: 'image', 
      width: 100,
      render: (_text: unknown, record: Artifact) => (
        record.image_url ? 
        <Image width={60} height={60} src={record.image_url} style={{ objectFit: 'cover', borderRadius: '4px' }} fallback="https://via.placeholder.com/60?text=No+Image" /> : 
        <span className="text-gray-400 italic">Trống</span>
      )
    },
    { title: 'Tên tác phẩm', dataIndex: 'title', key: 'title', width: 200 },
    { title: 'Tác giả', dataIndex: 'author', key: 'author', width: 150 },
    { 
      title: 'Vị trí trưng bày', 
      key: 'location',
      width: 200,
      render: (_text: unknown, record: Artifact) => (
        record.location_name ? 
        <span className="text-blue-600 font-medium">{record.location_name}</span> : 
        <span className="text-gray-400 italic">Chưa gắn mạch định vị</span>
      )
    },
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
        <h2 className="text-xl font-bold text-gray-800">Quản lý Hiện vật (Artifacts)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Hiện vật
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={artifacts} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingArtifact ? 'Cập nhật Hiện vật' : 'Thêm mới Hiện vật'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="title" label="Tên tác phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="VD: Nàng Mona Lisa" />
            </Form.Item>
            <Form.Item name="author" label="Tác giả">
              <Input placeholder="VD: Leonardo da Vinci" />
            </Form.Item>
          </div>

          <Form.Item name="beacon_id" label="Gắn kết với Mạch định vị (Chỉ hiện mạch đang rảnh)">
            <Select allowClear placeholder="Chọn mạch ESP32 trống">
              {beacons
                .filter(b => {
                  const isAssignedToOther = artifacts.some(a => a.beacon_id === b.id && a.id !== editingArtifact?.id);
                  return !isAssignedToOther; 
                })
                .map(b => (
                  <Select.Option key={b.id} value={b.id}>
                    Mạch ID: {b.id} (Major: {b.major}, Minor: {b.minor}) - {b.location_name}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>

        <Form.Item name="image_url" label="Đường dẫn Hình ảnh (URL)">
            <Input placeholder="Nhập link ảnh trên mạng (https://...)" />
        </Form.Item>

        <Form.Item name="audio_url" label="Đường dẫn Âm thanh (URL)">
            <Input placeholder="Nhập link file audio thuyết minh (https://...)" />
        </Form.Item>

        <Form.Item name="description" label="Nội dung thuyết minh">
            <Input.TextArea rows={5} placeholder="Nhập bài giới thiệu chi tiết về tác phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ArtifactManagement;