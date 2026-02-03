import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  userRole: 'admin' | 'manager' | 'annotator' | 'reviewer';
  onLogout: () => void;
}

function AdminLayout({ userRole, onLogout }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
    ];

    if (userRole === 'admin') {
      return [
        ...baseItems,
        {
          key: '/users',
          icon: <TeamOutlined />,
          label: 'Quản lý người dùng',
        },
        {
          key: '/settings',
          icon: <SettingOutlined />,
          label: 'Cấu hình hệ thống',
        },
        {
          key: '/logs',
          icon: <FileTextOutlined />,
          label: 'Nhật ký hoạt động',
        },
      ];
    }

    if (userRole === 'manager') {
      return [
        ...baseItems,
        {
          key: '/projects',
          icon: <ProjectOutlined />,
          label: 'Quản lý dự án',
        },
        {
          key: '/datasets',
          icon: <DatabaseOutlined />,
          label: 'Quản lý dữ liệu',
        },
        {
          key: '/labels',
          icon: <FileTextOutlined />,
          label: 'Thiết lập nhãn',
        },
        {
          key: '/assignments',
          icon: <TeamOutlined />,
          label: 'Phân công công việc',
        },
      ];
    }

    if (userRole === 'annotator') {
      return [
        ...baseItems,
        {
          key: '/tasks',
          icon: <CheckSquareOutlined />,
          label: 'Nhiệm vụ của tôi',
        },
        {
          key: '/labeling',
          icon: <FileTextOutlined />,
          label: 'Gán nhãn',
        },
      ];
    }

    if (userRole === 'reviewer') {
      return [
        ...baseItems,
        {
          key: '/review',
          icon: <CheckSquareOutlined />,
          label: 'Kiểm duyệt',
        },
        {
          key: '/review-history',
          icon: <FileTextOutlined />,
          label: 'Lịch sử kiểm duyệt',
        },
      ];
    }

    return baseItems;
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: onLogout,
    },
  ];

  const getRoleName = () => {
    switch (userRole) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      case 'annotator': return 'Annotator';
      case 'reviewer': return 'Reviewer';
      default: return 'User';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {collapsed ? 'DL' : 'Data Labeling'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18, cursor: 'pointer' }} />
            ) : (
              <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18, cursor: 'pointer' }} />
            )}
            <span style={{ fontSize: 16, fontWeight: 500 }}>
              Data Labeling Support System
            </span>
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#6366f1' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 500 }}>Người dùng</span>
                <span style={{ fontSize: 12, color: '#888' }}>{getRoleName()}</span>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
