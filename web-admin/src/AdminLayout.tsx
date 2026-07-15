import React, { useState } from 'react';
import { Layout, Menu, theme, Typography } from 'antd';
import {
  DashboardOutlined,
  WifiOutlined,
  PictureOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy màu nền từ theme mặc định của Antd
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Định nghĩa các mục menu của Sidebar
  const menuItems = [
    {
      key: '/artifacts',
      icon: <PictureOutlined />,
      label: 'Quản lý Hiện vật',
    },

    {
      key: '/beacons',
      icon: <WifiOutlined />,
      label: 'Quản lý Beacon',
    },

    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Thống kê (Dashboard)',
    },

  ];

  // Xử lý chuyển trang khi click vào menu
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="flex items-center justify-center h-16 m-2 bg-blue-50 rounded-md">
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
            {collapsed ? 'SM' : 'Smart Museum'}
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer }} className="flex justify-end items-center shadow-sm">
          <div
            className="flex items-center cursor-pointer text-gray-600 hover:text-red-500 transition-colors"
            onClick={() => {
              localStorage.removeItem('userInfo'); // Xóa phiên đăng nhập
              navigate('/login'); // Đẩy về trang đăng nhập
            }}
          >
            <LogoutOutlined className="mr-2" />
            <span>Đăng xuất</span>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {/* Outlet là nơi hiển thị các component con được định nghĩa trong React Router */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;