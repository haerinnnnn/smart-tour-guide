import React, { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Switch,
    message,
} from "antd";
interface Props {
    open: boolean;
    beacon: any;
    onClose: () => void;
    onSuccess: () => void;
}
const API = "http://localhost:3000/api/beacons";
const BeaconModal: React.FC<Props> = ({
    open,
    beacon,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (beacon) {
            form.setFieldsValue({
                uuid: beacon.uuid,
                major: beacon.major,
                minor: beacon.minor,
                location_name: beacon.location_name,
                is_active: Boolean(beacon.is_active),
            });
        } else {
            form.resetFields();
        }
    }, [beacon, form]);
    const saveBeacon = async () => {
        try {
            const values = await form.validateFields();
            const url = beacon
                ? `${API}/${beacon.id}`
                : API;
            const method = beacon
                ? "PUT"
                : "POST";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (result.success) {
                message.success(
                    beacon
                        ? "Cập nhật Beacon thành công"
                        : "Thêm Beacon thành công"

                );
                form.resetFields();
                onSuccess();
            } else {
                message.error(result.message);
            }
        }
        catch {
            message.error("Không thể lưu Beacon");
        }
    };
    return (
        <Modal
            title={
                beacon
                    ? "Cập nhật Beacon"
                    : "Thêm Beacon"
            }
            open={open}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            onOk={saveBeacon}
            okText="Lưu"
            cancelText="Hủy"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="UUID"
                    name="uuid"
                    rules={[
                        {
                            required: true,
                            message: "Nhập UUID",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Major"
                    name="major"
                    rules={[
                        {
                            required: true,
                            message: "Nhập Major",
                        },
                    ]}
                >
                    <InputNumber
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Minor"
                    name="minor"
                    rules={[
                        {
                            required: true,
                            message: "Nhập Minor",
                        },
                    ]}
                >
                    <InputNumber
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Tên vị trí"
                    name="location_name"
                    rules={[
                        {
                            required: true,
                            message: "Nhập vị trí",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Trạng thái"
                    name="is_active"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch
                        checkedChildren="Online"
                        unCheckedChildren="Offline"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default BeaconModal;