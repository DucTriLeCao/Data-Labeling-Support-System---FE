import { Card, Col, Row, Statistic, Progress, Table, Tag, Typography } from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

interface DashboardProps {
  userRole: 'admin' | 'manager' | 'annotator' | 'reviewer';
}

function Dashboard({ userRole }: DashboardProps) {
  // Sample data for recent activities
  const recentActivities = [
    { key: '1', action: 'Gán nhãn hoàn thành', project: 'Dataset A', user: 'Annotator 1', time: '5 phút trước', status: 'completed' },
    { key: '2', action: 'Duyệt nhãn', project: 'Dataset B', user: 'Reviewer 1', time: '10 phút trước', status: 'approved' },
    { key: '3', action: 'Trả về chỉnh sửa', project: 'Dataset A', user: 'Reviewer 2', time: '15 phút trước', status: 'rejected' },
    { key: '4', action: 'Tạo dự án mới', project: 'Dataset C', user: 'Manager', time: '1 giờ trước', status: 'new' },
  ];

  const activityColumns = [
    { title: 'Hoạt động', dataIndex: 'action', key: 'action' },
    { title: 'Dự án', dataIndex: 'project', key: 'project' },
    { title: 'Người thực hiện', dataIndex: 'user', key: 'user' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          completed: 'blue',
          approved: 'green',
          rejected: 'red',
          new: 'purple',
        };
        const labels: Record<string, string> = {
          completed: 'Hoàn thành',
          approved: 'Đã duyệt',
          rejected: 'Trả về',
          new: 'Mới',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
  ];

  // Stats for different roles
  const getStats = () => {
    if (userRole === 'admin') {
      return (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={156}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Dự án đang hoạt động"
                value={12}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng nhãn đã gán"
                value={45678}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={78.5}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#06b6d4' }}
              />
            </Card>
          </Col>
        </Row>
      );
    }

    if (userRole === 'manager') {
      return (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Dự án của tôi"
                value={5}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang chờ duyệt"
                value={234}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={1890}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Annotator"
                value={24}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#06b6d4' }}
              />
            </Card>
          </Col>
        </Row>
      );
    }

    if (userRole === 'annotator') {
      return (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Nhiệm vụ được giao"
                value={45}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#6366f1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={32}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đang xử lý"
                value={8}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Cần chỉnh sửa"
                value={5}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#ef4444' }}
              />
            </Card>
          </Col>
        </Row>
      );
    }

    // Reviewer
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ kiểm duyệt"
              value={28}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã duyệt hôm nay"
              value={15}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã trả về"
              value={3}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ duyệt"
              value={83.3}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#06b6d4' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      {getStats()}

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Hoạt động gần đây">
            <Table
              columns={activityColumns}
              dataSource={recentActivities}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tiến độ dự án">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Dataset A</span>
                <span>75%</span>
              </div>
              <Progress percent={75} showInfo={false} strokeColor="#6366f1" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Dataset B</span>
                <span>45%</span>
              </div>
              <Progress percent={45} showInfo={false} strokeColor="#22c55e" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Dataset C</span>
                <span>90%</span>
              </div>
              <Progress percent={90} showInfo={false} strokeColor="#f59e0b" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Dataset D</span>
                <span>20%</span>
              </div>
              <Progress percent={20} showInfo={false} strokeColor="#06b6d4" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
