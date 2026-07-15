import React, { useEffect, useState } from "react";

import {
    Modal,
    Form,
    Input,
    Select,
    Upload,
    Button,
    message,
} from "antd";

import {
    UploadOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

interface Artifact {
    id?: number;
    title: string;
    author: string;
    description: string;
    image_url: string;
    audio_url: string;
    beacon_id: number | null;
    location_name?: string;
    uuid?: string;
    major?: number;
    minor?: number;
}

interface Beacon {

    id: number;

    location_name: string;

}

interface Props {

    open: boolean;

    artifact: Artifact | null;

    onCancel: () => void;

    onSuccess: () => void;

}

const ArtifactModal: React.FC<Props> = ({

    open,

    artifact,

    onCancel,

    onSuccess,

}) => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [beacons, setBeacons] = useState<Beacon[]>([]);

    const [imageUrl, setImageUrl] = useState("");

    const [audioUrl, setAudioUrl] = useState("");
    //----------------------------------------------------
    // Load Beacon
    //----------------------------------------------------

    const loadBeacons = async () => {

        try {

            const response = await fetch(

                "http://localhost:3000/api/beacons"

            );

            const result = await response.json();

            if (result.success) {

                setBeacons(result.data);

            }

        }

        catch {

            message.error("Không tải được danh sách Beacon");

        }

    };
    //----------------------------------------------------
    // Fill dữ liệu
    //----------------------------------------------------

    useEffect(() => {

        loadBeacons();

        if (artifact) {

            form.setFieldsValue({

                title: artifact.title,

                author: artifact.author,

                description: artifact.description,

                beacon_id: artifact.beacon_id,

            });

            setImageUrl(artifact.image_url);

            setAudioUrl(artifact.audio_url);

        }

        else {

            form.resetFields();

            setImageUrl("");

            setAudioUrl("");

        }

    }, [artifact, open]);
    //----------------------------------------------------
    // Upload Image
    //----------------------------------------------------

    const uploadImage = async (

        file: File

    ) => {

        const formData = new FormData();

        formData.append(

            "file",

            file

        );

        const response = await fetch(

            "http://localhost:3000/api/artifacts/upload",

            {

                method: "POST",

                body: formData,

            }

        );

        const result = await response.json();

        if (result.success) {

            setImageUrl(

                result.url

            );

            message.success("Upload ảnh thành công");

        }

    };
    //----------------------------------------------------
    // Upload Audio
    //----------------------------------------------------

    const uploadAudio = async (

        file: File

    ) => {

        const formData = new FormData();

        formData.append(

            "file",

            file

        );

        const response = await fetch(

            "http://localhost:3000/api/artifacts/upload",

            {

                method: "POST",

                body: formData,

            }

        );

        const result = await response.json();

        if (result.success) {

            setAudioUrl(

                result.url

            );

            message.success("Upload audio thành công");

        }

    };
    //----------------------------------------------------
    // Submit Form
    //----------------------------------------------------

    const handleSubmit = async () => {

        try {

            const values = await form.validateFields();

            setLoading(true);

            const body = {

                title: values.title,

                author: values.author,

                description: values.description,

                beacon_id: values.beacon_id,

                image_url: imageUrl,

                audio_url: audioUrl,

            };

            let response;

            // Edit
            if (artifact?.id) {

                response = await fetch(

                    `http://localhost:3000/api/artifacts/${artifact.id}`,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type": "application/json",

                        },

                        body: JSON.stringify(body),

                    }

                );

            }

            // Add
            else {

                response = await fetch(

                    "http://localhost:3000/api/artifacts",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json",

                        },

                        body: JSON.stringify(body),

                    }

                );

            }

            const result = await response.json();

            if (result.success) {

                message.success(

                    artifact

                        ? "Cập nhật hiện vật thành công"

                        : "Thêm hiện vật thành công"

                );

                onSuccess();

                form.resetFields();

                setImageUrl("");

                setAudioUrl("");

            }

            else {

                message.error(result.message);

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };
    return (

        <Modal

            open={open}

            title={

                artifact

                    ? "Cập nhật hiện vật"

                    : "Thêm hiện vật"

            }

            width={750}

            destroyOnClose

            confirmLoading={loading}

            onCancel={onCancel}

            onOk={handleSubmit}

            okText="Lưu"

            cancelText="Hủy"

        >

            <Form

                form={form}

                layout="vertical"

            >

                <Form.Item

                    label="Tên hiện vật"

                    name="title"

                    rules={[

                        {

                            required: true,

                            message: "Nhập tên hiện vật"

                        }

                    ]}

                >

                    <Input />

                </Form.Item>

                <Form.Item

                    label="Tác giả"

                    name="author"

                >

                    <Input />

                </Form.Item>

                <Form.Item

                    label="Beacon"

                    name="beacon_id"

                >

                    <Select

                        allowClear

                        placeholder="Chọn Beacon"

                    >

                        {

                            beacons.map(

                                beacon => (

                                    <Select.Option

                                        key={beacon.id}

                                        value={beacon.id}

                                    >

                                        {beacon.location_name}

                                    </Select.Option>

                                )

                            )

                        }

                    </Select>

                </Form.Item>

                <Form.Item

                    label="Mô tả"

                    name="description"

                >

                    <TextArea

                        rows={5}

                    />

                </Form.Item>

                <Form.Item

                    label="Ảnh"

                >

                    <Upload

                        showUploadList={false}

                        beforeUpload={(file) => {

                            uploadImage(file);

                            return false;

                        }}

                    >

                        <Button

                            icon={<UploadOutlined />}

                        >

                            Upload Image

                        </Button>

                    </Upload>

                    {

                        imageUrl && (

                            <img

                                src={`http://localhost:3000${imageUrl}`}

                                style={{

                                    marginTop: 15,

                                    width: 180,

                                    borderRadius: 8

                                }}

                            />

                        )

                    }

                </Form.Item>

                <Form.Item

                    label="Audio"

                >

                    <Upload

                        showUploadList={false}

                        beforeUpload={(file) => {

                            uploadAudio(file);

                            return false;

                        }}

                    >

                        <Button

                            icon={<UploadOutlined />}

                        >

                            Upload Audio

                        </Button>

                    </Upload>

                    {

                        audioUrl && (

                            <audio

                                controls

                                style={{

                                    marginTop: 15,

                                    width: "100%"

                                }}

                            >

                                <source

                                    src={`http://localhost:3000${audioUrl}`}

                                />

                            </audio>

                        )

                    }

                </Form.Item>

            </Form>

        </Modal>

    );
};

export default ArtifactModal;
