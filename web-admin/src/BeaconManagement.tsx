import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CodeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Paragraph } = Typography;

const API_URL = 'http://localhost:3000/api/beacons';

interface Beacon {
  id: number;
  mac_address?: string;
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

  // State cho hộp thoại hiển thị mã C++
  const [isCodeModalVisible, setIsCodeModalVisible] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');

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
    const timer = setTimeout(() => fetchBeacons(), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success('Xóa Beacon thành công');
      fetchBeacons();
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Lỗi khi xóa Beacon');
    }
  };

  const handleAdd = () => {
    setEditingBeacon(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Beacon) => {
    setEditingBeacon(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Hàm chuyển số nguyên thành chuỗi Hexa 2 byte (VD: 1 -> "0x00", "0x01")
  const toHexBytes = (num: number) => {
    const hex = num.toString(16).padStart(4, '0');
    return {
      high: `0x${hex.substring(0, 2).toUpperCase()}`,
      low: `0x${hex.substring(2, 4).toUpperCase()}`
    };
  };

  // Hàm chuyển chuỗi UUID thành mảng Hexa C++
  const formatUuidToCppArray = (uuid: string) => {
    const cleanUuid = uuid.replace(/-/g, '');
    const bytes = [];
    for (let i = 0; i < cleanUuid.length; i += 2) {
      bytes.push(`0x${cleanUuid.substring(i, i + 2).toUpperCase()}`);
    }
    return bytes.join(', ');
  };

  const generateCppCode = (uuid: string, major: number, minor: number) => {
    const majorHex = toHexBytes(major);
    const minorHex = toHexBytes(minor);
    const uuidArray = formatUuidToCppArray(uuid);

    return `#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>

void setup() {
  Serial.begin(115200);
  delay(3000); 
  Serial.println("Starting BLE...");
  BLEDevice::init("Smart Museum Beacon");
  
  // In địa chỉ MAC ra Serial Monitor để copy lên Web Admin
  Serial.printf("\\n====================================\\n");
  Serial.printf("MAC ADDRESS: %s\\n", BLEDevice::getAddress().toString().c_str());
  Serial.printf("====================================\\n\\n");

  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_ADV, ESP_PWR_LVL_N12);

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  BLEAdvertisementData oAdvertisementData = BLEAdvertisementData();
  
  oAdvertisementData.setFlags(0x06);

  std::string mfgData = "";
  mfgData += (char)0xE5;
  mfgData += (char)0x02;
  mfgData += (char)0x02; 
  mfgData += (char)0x15; 
  
  // UUID: ${uuid}
  uint8_t uuidArr[16] = {${uuidArray}};
  for (int i=0; i<16; i++) {
    mfgData += (char)uuidArr[i];
  }
  
  // Major: ${major}
  mfgData += (char)${majorHex.high}; 
  mfgData += (char)${majorHex.low};
  
  // Minor: ${minor}
  mfgData += (char)${minorHex.high}; 
  mfgData += (char)${minorHex.low};
  
  mfgData += (char)0xB9;

  oAdvertisementData.setManufacturerData(mfgData);
  pAdvertising->setAdvertisementData(oAdvertisementData);

  BLEAdvertisementData oScanResponseData = BLEAdvertisementData();
  oScanResponseData.setName("Museum Beacon M${major}-m${minor}");
  pAdvertising->setScanResponseData(oScanResponseData);
  
  pAdvertising->start();
  Serial.println("Advertising Standard iBeacon!");
}

void loop() {
  delay(1000);
}`;
  };


  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      const parsedMajor = parseInt(values.major, 10);
      const parsedMinor = parseInt(values.minor, 10);
      const duplicateMac = values.mac_address 
        ? beacons.find(b => b.id !== editingBeacon?.id && b.mac_address === values.mac_address.trim()) 
        : null;
      const duplicateMajorMinor = beacons.find(b => 
        b.id !== editingBeacon?.id && b.major === parsedMajor && b.minor === parsedMinor
      );

      if (duplicateMac) {
        message.error(`LỖI: Địa chỉ MAC "${values.mac_address}" đã được sử dụng cho thiết bị khác!`);
        return;
      }
      if (duplicateMajorMinor) {
        message.error(`LỖI: Cặp định vị (Major: ${parsedMajor}, Minor: ${parsedMinor}) đã tồn tại! Vui lòng chọn số khác.`);
        return;
      }
      const beaconPayload = {
        mac_address: values.mac_address ? values.mac_address.trim() : null,
        uuid: values.uuid,
        major: parsedMajor,
        minor: parsedMinor,
        location_name: values.location_name
      };

      try {
        if (editingBeacon) {
          // Kịch bản Cập nhật
          await axios.put(`${API_URL}/${editingBeacon.id}`, beaconPayload);
          message.success('Cập nhật thông số Beacon thành công');
          setIsModalVisible(false);
          fetchBeacons();
        } else {
          // Kịch bản Thêm mới
          const beaconRes = await axios.post(API_URL, beaconPayload);
          const newBeaconId = beaconRes.data.data.id; 
          
          message.success('Thêm phần cứng thành công!');

          // Tạo Hiện vật nếu có nhập tên
          if (values.artifact_title) {
            const artifactPayload = {
              beacon_id: newBeaconId,
              title: values.artifact_title,
              author: values.artifact_author || 'Ẩn danh',
              image_url: values.artifact_image_url || '',
              audio_url: values.artifact_audio_url || ''
            };
            await axios.post('http://localhost:3000/api/artifacts', artifactPayload);
            message.success('Đã tạo và liên kết Hiện vật tự động!');
          }

          setIsModalVisible(false);
          fetchBeacons();

          const code = generateCppCode(beaconPayload.uuid, beaconPayload.major, beaconPayload.minor);
          setGeneratedCode(code);
          setIsCodeModalVisible(true);
        }
      } catch (error: any) {
        console.error('Submit Error:', error);
        message.error('Có lỗi xảy ra khi giao tiếp với máy chủ');
      }
    });
  };

  const columns = [
    { title: 'STT', 
      key: 'stt', 
      width: 60, 
      render: (_text: unknown, _record: Beacon, index: number) => index + 1 },
    { title: 'MAC Address', dataIndex: 'mac_address', key: 'mac_address' },
    { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
    { title: 'Major', dataIndex: 'major', key: 'major', width: 100 },
    { title: 'Minor', dataIndex: 'minor', key: 'minor', width: 100 },
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
          <Button 
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
            icon={<CodeOutlined />} 
            onClick={() => {
              const code = generateCppCode(record.uuid, record.major, record.minor);
              setGeneratedCode(code);
              setIsCodeModalVisible(true);
            }} 
            title="Lấy mã C++"
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
          Thêm mới thiết bị
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
        width={600} 
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="mac_address"
            label="MAC Address"
          >
            <Input placeholder="VD: AA:BB:CC:DD:EE:FF (Có thể cập nhật sau)" />
          </Form.Item>
          <Form.Item
            name="uuid"
            label="UUID"
            rules={[{ required: true, message: 'Vui lòng nhập UUID!' }]}
          >
            <Input placeholder="VD: 12345678-1234-1234-1234-123456789012" />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* ĐÃ THÊM LẠI Ô LOCATION_NAME BỊ THIẾU Ở ĐÂY */}
          <Form.Item
            name="location_name"
            label="Khu vực trưng bày"
            rules={[{ required: true, message: 'Vui lòng nhập tên Khu vực!' }]}
          >
            <Input placeholder="VD: Khu vực Nghệ thuật Phục Hưng" />
          </Form.Item>

          {/* CHỈ HIỂN THỊ KHU VỰC NÀY KHI THÊM MỚI THIẾT BỊ */}
          {!editingBeacon && (
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px dashed #e8e8e8' }}>
              <h3 className="text-base font-semibold text-gray-500 mb-2">Móc nối Hiện vật (Tùy chọn)</h3>
              <p className="text-xs text-gray-400 mb-4 italic">
                Nhập thông tin dưới đây để hệ thống tự động tạo và gắn chặt bức tranh vào thiết bị này.
              </p>
              
              <Form.Item name="artifact_title" label={<span className="text-gray-500">Tên tác phẩm (Nếu có)</span>}>
                <Input placeholder="VD: Đêm đầy sao" />
              </Form.Item>
              <Form.Item name="artifact_author" label={<span className="text-gray-500">Tác giả</span>}>
                <Input placeholder="VD: Vincent van Gogh" />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="artifact_image_url" label={<span className="text-gray-500">Link Hình ảnh</span>}>
                  <Input placeholder="https://..." />
                </Form.Item>
                <Form.Item name="artifact_audio_url" label={<span className="text-gray-500">Link Âm thanh</span>}>
                  <Input placeholder="https://..." />
                </Form.Item>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Modal Hiển thị mã C++ */}
      <Modal
        title={
          <div style={{ color: '#1677ff' }}>
            <CodeOutlined className="mr-2" />
            Mã nguồn C++ cho ESP32
          </div>
        }
        open={isCodeModalVisible}
        onCancel={() => setIsCodeModalVisible(false)}
        footer={[
          <Button 
            key="copy" 
            type="primary" 
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              message.success('Đã sao chép mã nguồn vào khay nhớ tạm!');
            }}
          >
            Sao chép Code
          </Button>,
          <Button key="close" onClick={() => setIsCodeModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        <div style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
          <Paragraph style={{ color: '#d4d4d4', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
            {generatedCode}
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default BeaconManagement;