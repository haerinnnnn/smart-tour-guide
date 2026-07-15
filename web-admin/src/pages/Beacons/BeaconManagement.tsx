import React, { useEffect, useState } from "react";

import {

    Typography,

    Card,

    Button,

    Input,

    Row,

    Col,

    Space,

    message,

} from "antd";

import {

    PlusOutlined,

    ReloadOutlined,

} from "@ant-design/icons";

import BeaconTable from "../../components/Beacons/BeaconTable";
import BeaconModal from "../../components/Beacons/BeaconModal";

const { Title } = Typography;
const { Search } = Input;

const API = "http://localhost:3000/api/beacons";

const BeaconManagement: React.FC = () => {

    const [loading, setLoading] = useState(false);

    const [beacons, setBeacons] = useState<any[]>([]);

    const [searchText, setSearchText] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const [editingBeacon, setEditingBeacon] = useState<any>(null);

    const loadBeacons = async () => {

        try {

            setLoading(true);

            const response = await fetch(API);

            const result = await response.json();

            if (result.success) {

                setBeacons(result.data);

            }

        }

        catch {

            message.error("Không thể tải danh sách Beacon");

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadBeacons();

    }, []);

    const filteredData = beacons.filter((item) => {

        const keyword = searchText.toLowerCase();

        return (

            item.uuid.toLowerCase().includes(keyword)

            ||

            item.location_name.toLowerCase().includes(keyword)

            ||

            item.major.toString().includes(keyword)

            ||

            item.minor.toString().includes(keyword)

        );

    });

    return (

        <>

            <Title level={2}>

                Quản lý Beacon

            </Title>

            <Card>

                <Row justify="space-between">

                    <Col>

                        <Search

                            placeholder="Tìm UUID, Major, Minor..."

                            style={{ width: 320 }}

                            allowClear

                            onChange={(e) =>

                                setSearchText(e.target.value)

                            }

                        />

                    </Col>

                    <Col>

                        <Space>

                            <Button

                                icon={<ReloadOutlined />}

                                onClick={loadBeacons}

                            >

                                Refresh

                            </Button>

                            <Button

                                type="primary"

                                icon={<PlusOutlined />}

                                onClick={() => {

                                    setEditingBeacon(null);

                                    setOpenModal(true);

                                }}

                            >

                                Thêm Beacon

                            </Button>

                        </Space>

                    </Col>

                </Row>

            </Card>

            <Card style={{ marginTop: 20 }}>

                <BeaconTable

                    loading={loading}

                    data={filteredData}

                    onEdit={(record) => {

                        setEditingBeacon(record);

                        setOpenModal(true);

                    }}

                    onDelete={loadBeacons}

                />

            </Card>

            <BeaconModal

                open={openModal}

                beacon={editingBeacon}

                onClose={() =>

                    setOpenModal(false)

                }

                onSuccess={() => {

                    setOpenModal(false);

                    loadBeacons();

                }}

            />

        </>

    );

};

export default BeaconManagement;
