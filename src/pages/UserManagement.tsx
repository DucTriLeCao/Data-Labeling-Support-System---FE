import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Card, Typography, message, Avatar, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface User {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const [users, setUsers] = useState<User[]>([
    { key: '1', name: 'Nguyễn Văn A', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2026-01-01' },
    { key: '2', name: 'Trần Thị B', email: 'manager@example.com', role: 'manager', status: 'active', createdAt: '2026-01-05' },
    { key: '3', name: 'Lê Văn C', email: 'annotator1@example.com', role: 'annotator', status: 'active', createdAt: '2026-01-10' },
    { key: '4', name: 'Phạm Thị D', email: 'annotator2@example.com', role: 'annotator', status: 'active', createdAt: '2026-01-12' },
    { key: '5', name: 'Hoàng Văn E', email: 'reviewer@example.com', role: 'reviewer', status: 'active', createdAt: '2026-01-15' },
    { key: '6', name: 'Vũ Thị F', email: 'annotator3@example.com', role: 'annotator', status: 'inactive', createdAt: '2026-01-20' },
  ]);

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: unknown, record: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#6366f1' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = {
          admin: 'red',
          manager: 'purple',
          annotator: 'blue',
          reviewer: 'green',
        };
        const labels: Record<string, string> = {
          admin: 'Admin',
          manager: 'Manager',
          annotator: 'Annotator',
          reviewer: 'Reviewer',
        };
        return <Tag color={colors[role]}>{labels[role]}</Tag>;
      },
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Annotator', value: 'annotator' },
        { text: 'Reviewer', value: 'reviewer' },
      ],
      onFilter: (value: unknown, record: User) => record.role === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Ngừng hoạt động', value: 'inactive' },
      ],
      onFilter: (value: unknown, record: User) => record.status === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: User, b: User) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    setUsers(users.filter(u => u.key !== key));
    message.success('Đã xóa người dùng');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        setUsers(users.map(u => 
          u.key === editingUser.key ? { ...u, ...values } : u
        ));
        message.success('Đã cập nhật người dùng');
      } else {
        const newUser: User = {
          key: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        message.success('Đã thêm người dùng mới');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý người dùng</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#6366f1' }}
        >
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingUser ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
              <Select.Option value="annotator">Annotator</Select.Option>
              <Select.Option value="reviewer">Reviewer</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
