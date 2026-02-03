import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Card, Typography, message, Progress, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

interface Project {
  key: string;
  name: string;
  description: string;
  status: string;
  dataCount: number;
  labeledCount: number;
  annotators: number;
  createdAt: string;
}

function ProjectManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  const [projects, setProjects] = useState<Project[]>([
    {
      key: '1',
      name: 'Image Classification',
      description: 'Phân loại hình ảnh sản phẩm',
      status: 'active',
      dataCount: 5000,
      labeledCount: 3750,
      annotators: 5,
      createdAt: '2026-01-15',
    },
    {
      key: '2',
      name: 'Text Sentiment',
      description: 'Phân tích cảm xúc văn bản',
      status: 'active',
      dataCount: 10000,
      labeledCount: 4500,
      annotators: 8,
      createdAt: '2026-01-20',
    },
    {
      key: '3',
      name: 'Object Detection',
      description: 'Nhận diện đối tượng trong ảnh',
      status: 'completed',
      dataCount: 2000,
      labeledCount: 2000,
      annotators: 3,
      createdAt: '2026-01-10',
    },
    {
      key: '4',
      name: 'NER Dataset',
      description: 'Gán nhãn thực thể trong văn bản',
      status: 'pending',
      dataCount: 8000,
      labeledCount: 0,
      annotators: 0,
      createdAt: '2026-02-01',
    },
  ]);

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'blue',
          completed: 'green',
          pending: 'orange',
        };
        const labels: Record<string, string> = {
          active: 'Đang thực hiện',
          completed: 'Hoàn thành',
          pending: 'Chờ bắt đầu',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
      filters: [
        { text: 'Đang thực hiện', value: 'active' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Chờ bắt đầu', value: 'pending' },
      ],
      onFilter: (value: unknown, record: Project) => record.status === value,
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_: unknown, record: Project) => {
        const percent = Math.round((record.labeledCount / record.dataCount) * 100);
        return (
          <div style={{ minWidth: 120 }}>
            <Progress percent={percent} size="small" />
            <div style={{ fontSize: 12, color: '#888' }}>
              {record.labeledCount.toLocaleString()}/{record.dataCount.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Annotators',
      dataIndex: 'annotators',
      key: 'annotators',
      align: 'center' as const,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Project, b: Project) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Project) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" icon={<ExportOutlined />} onClick={() => handleExport(record)} />
          <Popconfirm
            title="Xóa dự án"
            description="Bạn có chắc chắn muốn xóa dự án này?"
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

  const handleView = (project: Project) => {
    message.info(`Xem chi tiết dự án: ${project.name}`);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue(project);
    setIsModalOpen(true);
  };

  const handleExport = (project: Project) => {
    message.success(`Đang xuất dữ liệu dự án: ${project.name}`);
  };

  const handleDelete = (key: string) => {
    setProjects(projects.filter(p => p.key !== key));
    message.success('Đã xóa dự án');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingProject) {
        // Update existing project
        setProjects(projects.map(p => 
          p.key === editingProject.key ? { ...p, ...values } : p
        ));
        message.success('Đã cập nhật dự án');
      } else {
        // Create new project
        const newProject: Project = {
          key: Date.now().toString(),
          ...values,
          dataCount: 0,
          labeledCount: 0,
          annotators: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setProjects([...projects, newProject]);
        message.success('Đã tạo dự án mới');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý dự án</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#6366f1' }}
        >
          Tạo dự án mới
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={projects}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingProject ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingProject ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Tên dự án"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
          >
            <Input placeholder="Nhập tên dự án" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Mô tả dự án" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="pending"
          >
            <Select>
              <Select.Option value="pending">Chờ bắt đầu</Select.Option>
              <Select.Option value="active">Đang thực hiện</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProjectManagement;
