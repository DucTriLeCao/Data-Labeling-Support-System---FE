import { useState } from 'react';
import { Table, Button, Tag, Space, Card, Typography, message, Tabs, Badge, Modal, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Task {
  key: string;
  dataId: string;
  project: string;
  type: string;
  status: string;
  assignedAt: string;
  submittedAt?: string;
  feedback?: string;
}

interface TaskListProps {
  userRole: 'annotator' | 'reviewer';
}

function TaskList({ userRole }: TaskListProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState('');

  const annotatorTasks: Task[] = [
    { key: '1', dataId: 'IMG-001', project: 'Image Classification', type: 'image', status: 'pending', assignedAt: '2026-02-01' },
    { key: '2', dataId: 'IMG-002', project: 'Image Classification', type: 'image', status: 'pending', assignedAt: '2026-02-01' },
    { key: '3', dataId: 'TXT-001', project: 'Text Sentiment', type: 'text', status: 'in-progress', assignedAt: '2026-01-30' },
    { key: '4', dataId: 'IMG-003', project: 'Image Classification', type: 'image', status: 'submitted', assignedAt: '2026-01-28', submittedAt: '2026-01-29' },
    { key: '5', dataId: 'TXT-002', project: 'Text Sentiment', type: 'text', status: 'rejected', assignedAt: '2026-01-25', feedback: 'Nhãn chưa chính xác, vui lòng kiểm tra lại' },
    { key: '6', dataId: 'IMG-004', project: 'Object Detection', type: 'image', status: 'approved', assignedAt: '2026-01-20', submittedAt: '2026-01-22' },
  ];

  const reviewerTasks: Task[] = [
    { key: '1', dataId: 'IMG-003', project: 'Image Classification', type: 'image', status: 'pending-review', assignedAt: '2026-02-01', submittedAt: '2026-02-02' },
    { key: '2', dataId: 'TXT-003', project: 'Text Sentiment', type: 'text', status: 'pending-review', assignedAt: '2026-02-01', submittedAt: '2026-02-02' },
    { key: '3', dataId: 'IMG-005', project: 'Image Classification', type: 'image', status: 'pending-review', assignedAt: '2026-01-30', submittedAt: '2026-02-01' },
    { key: '4', dataId: 'TXT-004', project: 'NER Dataset', type: 'text', status: 'approved', assignedAt: '2026-01-28', submittedAt: '2026-01-29' },
    { key: '5', dataId: 'IMG-006', project: 'Object Detection', type: 'image', status: 'rejected', assignedAt: '2026-01-25', feedback: 'Bounding box không chính xác' },
  ];

  const tasks = userRole === 'annotator' ? annotatorTasks : reviewerTasks;

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      'pending': { color: 'default', label: 'Chờ xử lý' },
      'in-progress': { color: 'processing', label: 'Đang thực hiện' },
      'submitted': { color: 'blue', label: 'Đã nộp' },
      'pending-review': { color: 'orange', label: 'Chờ duyệt' },
      'approved': { color: 'green', label: 'Đã duyệt' },
      'rejected': { color: 'red', label: 'Trả về' },
    };
    return <Tag color={config[status]?.color}>{config[status]?.label}</Tag>;
  };

  const annotatorColumns = [
    { title: 'Mã dữ liệu', dataIndex: 'dataId', key: 'dataId' },
    { title: 'Dự án', dataIndex: 'project', key: 'project' },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type === 'image' ? 'Hình ảnh' : 'Văn bản'}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    { title: 'Ngày giao', dataIndex: 'assignedAt', key: 'assignedAt' },
    {
      title: 'Phản hồi',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (feedback?: string) => feedback ? (
        <Text type="danger" style={{ fontSize: 12 }}>{feedback}</Text>
      ) : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewData(record)}>
            Xem
          </Button>
          {(record.status === 'pending' || record.status === 'in-progress' || record.status === 'rejected') && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleLabel(record)} style={{ backgroundColor: '#6366f1' }}>
              Gán nhãn
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const reviewerColumns = [
    { title: 'Mã dữ liệu', dataIndex: 'dataId', key: 'dataId' },
    { title: 'Dự án', dataIndex: 'project', key: 'project' },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type === 'image' ? 'Hình ảnh' : 'Văn bản'}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    { title: 'Ngày nộp', dataIndex: 'submittedAt', key: 'submittedAt' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewData(record)}>
            Xem
          </Button>
          {record.status === 'pending-review' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record)} style={{ backgroundColor: '#22c55e' }}>
                Duyệt
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => handleOpenReject(record)}>
                Trả về
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleViewData = (task: Task) => {
    message.info(`Xem dữ liệu: ${task.dataId}`);
  };

  const handleLabel = (task: Task) => {
    message.info(`Mở giao diện gán nhãn cho: ${task.dataId}`);
  };

  const handleApprove = (task: Task) => {
    message.success(`Đã duyệt: ${task.dataId}`);
  };

  const handleOpenReject = (task: Task) => {
    setSelectedTask(task);
    setFeedback('');
    setReviewModalOpen(true);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      message.error('Vui lòng nhập lý do trả về');
      return;
    }
    message.warning(`Đã trả về: ${selectedTask?.dataId} - ${feedback}`);
    setReviewModalOpen(false);
    setSelectedTask(null);
    setFeedback('');
  };

  const getFilteredTasks = (status: string) => {
    if (status === 'all') return tasks;
    if (userRole === 'annotator') {
      if (status === 'pending') return tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
      if (status === 'submitted') return tasks.filter(t => t.status === 'submitted');
      if (status === 'rejected') return tasks.filter(t => t.status === 'rejected');
      if (status === 'approved') return tasks.filter(t => t.status === 'approved');
    } else {
      if (status === 'pending') return tasks.filter(t => t.status === 'pending-review');
      if (status === 'approved') return tasks.filter(t => t.status === 'approved');
      if (status === 'rejected') return tasks.filter(t => t.status === 'rejected');
    }
    return tasks;
  };

  const annotatorTabs = [
    { key: 'pending', label: <Badge count={getFilteredTasks('pending').length} offset={[10, 0]}>Chờ xử lý</Badge> },
    { key: 'submitted', label: <Badge count={getFilteredTasks('submitted').length} offset={[10, 0]} color="blue">Đã nộp</Badge> },
    { key: 'rejected', label: <Badge count={getFilteredTasks('rejected').length} offset={[10, 0]} color="red">Trả về</Badge> },
    { key: 'approved', label: <Badge count={getFilteredTasks('approved').length} offset={[10, 0]} color="green">Đã duyệt</Badge> },
  ];

  const reviewerTabs = [
    { key: 'pending', label: <Badge count={getFilteredTasks('pending').length} offset={[10, 0]}>Chờ duyệt</Badge> },
    { key: 'approved', label: <Badge count={getFilteredTasks('approved').length} offset={[10, 0]} color="green">Đã duyệt</Badge> },
    { key: 'rejected', label: <Badge count={getFilteredTasks('rejected').length} offset={[10, 0]} color="red">Đã trả về</Badge> },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        {userRole === 'annotator' ? 'Nhiệm vụ của tôi' : 'Danh sách kiểm duyệt'}
      </Title>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={userRole === 'annotator' ? annotatorTabs : reviewerTabs}
        />
        <Table
          columns={userRole === 'annotator' ? annotatorColumns : reviewerColumns}
          dataSource={getFilteredTasks(activeTab)}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Trả về chỉnh sửa"
        open={reviewModalOpen}
        onOk={handleReject}
        onCancel={() => setReviewModalOpen(false)}
        okText="Xác nhận trả về"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginTop: 16 }}>
          <Text>Mã dữ liệu: <strong>{selectedTask?.dataId}</strong></Text>
          <div style={{ marginTop: 16 }}>
            <Text>Lý do trả về:</Text>
            <TextArea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Nhập lý do trả về để annotator chỉnh sửa..."
              style={{ marginTop: 8 }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;
