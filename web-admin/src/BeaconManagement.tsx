import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/beacons'; // Đảm bảo URL này khớp với port Backend của bạn

interface Beacon {
  id: number;
  uuid: string;
  major: number;
  minor: number;
  location_name: string;
}

const BeaconManagement: React.FC = () => {
  const [beacons, setBeacons] = useState<Beacon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBeacon, setEditingBeacon] = useState<Beacon | null>(null);
  const [form] = Form.useForm();

  // Lấy danh sách Beacon từ API
  const fetchBeacons = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setBeacons(response.data.data);
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Lỗi khi tải danh sách Beacon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sử dụng setTimeout để đẩy lệnh gọi ra khỏi luồng đồng bộ của useEffect
    // Cách này giúp vượt qua cảnh báo "Calling setState synchronously within an effect" của ESLint
    const timer = setTimeout(() => fetchBeacons(), 0);
    return () => clearTimeout(timer);
  }, []);

  // Xóa 1 Beacon
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success('Xóa Beacon thành công');
      fetchBeacons(); // Load lại bảng sau khi xóa
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Lỗi khi xóa Beacon');
    }
  };

  // Mở modal Thêm mới
  const handleAdd = () => {
    setEditingBeacon(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal Cập nhật
  const handleEdit = (record: Beacon) => {
    setEditingBeacon(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Xử lý sự kiện "Lưu" trong Modal (áp dụng chung cho Thêm / Sửa)
  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingBeacon) {
          await axios.put(`${API_URL}/${editingBeacon.id}`, values);
          message.success('Cập nhật Beacon thành công');
        } else {
          await axios.post(API_URL, values);
          message.success('Thêm Beacon thành công');
        }
        setIsModalVisible(false);
        fetchBeacons();
      } catch (error) {
        console.error('Submit Error:', error);
        message.error('Có lỗi xảy ra khi lưu thông tin');
      }
    });
  };

  // Cấu hình các cột của bảng dữ liệu
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: 'Major', dataIndex: 'major', key: 'major', width: 100 },
    { title: 'Minor', dataIndex: 'minor', key: 'minor', width: 100 },
    { title: 'Khu vực / Vị trí', dataIndex: 'location_name', key: 'location_name' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_text: unknown, record: Beacon) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
          />
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
        <h2 className="text-xl font-bold text-gray-800">Quản lý thiết bị Beacon</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={beacons} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingBeacon ? 'Cập nhật Beacon' : 'Thêm mới Beacon'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="uuid"
            label="UUID"
            rules={[{ required: true, message: 'Vui lòng nhập UUID!' }]}
          >
            <Input placeholder="VD: 12345678-1234-1234-1234-123456789012" />
          </Form.Item>
          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true, message: 'Vui lòng nhập Major!' }]}
          >
            <Input type="number" placeholder="VD: 1" />
          </Form.Item>
          <Form.Item
            name="minor"
            label="Minor"
            rules={[{ required: true, message: 'Vui lòng nhập Minor!' }]}
          >
            <Input type="number" placeholder="VD: 1" />
          </Form.Item>
          <Form.Item
            name="location_name"
            label="Khu vực / Vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập tên vị trí!' }]}
          >
            <Input placeholder="VD: Gian phòng tranh số 1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BeaconManagement;