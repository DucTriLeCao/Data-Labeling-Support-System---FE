import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import './App.css';
import Register from './Register';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProjectManagement from './pages/ProjectManagement';
import UserManagement from './pages/UserManagement';
import TaskList from './pages/TaskList';

function Login({ onSwitchToRegister, onLogin }: { onSwitchToRegister: () => void; onLogin: (role: 'admin' | 'manager' | 'annotator' | 'reviewer') => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login with different roles based on email
    if (email.includes('admin')) {
      onLogin('admin');
    } else if (email.includes('manager')) {
      onLogin('manager');
    } else if (email.includes('reviewer')) {
      onLogin('reviewer');
    } else {
      onLogin('annotator');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Đăng nhập</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Mật khẩu</label>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src="/hiddeneye.png" alt="Toggle password" />
                <span>{showPassword ? 'Hiện' : 'Ẩn'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="#" className="forgot-password">Quên mật khẩu ?</a>

          <button type="submit" className="login-btn">Đăng nhập</button>
        </form>

        <div className="divider">
          <span>Hoặc</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn facebook">
            <img src="/fb.png" alt="Facebook" />
          </button>
          <button className="social-btn google">
            <img src="/gg.png" alt="Google" />
          </button>
        </div>

        <p className="signup-link">
          Chưa có tài khoản ? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>Đăng kí</a>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>('login');
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'annotator' | 'reviewer'>('annotator');

  const handleLogin = (role: 'admin' | 'manager' | 'annotator' | 'reviewer') => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  if (currentPage === 'register') {
    return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <ConfigProvider locale={viVN} theme={{ token: { colorPrimary: '#6366f1' } }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLayout userRole={userRole} onLogout={handleLogout} />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard userRole={userRole} />} />
              {/* Admin routes */}
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<div>Cấu hình hệ thống</div>} />
              <Route path="logs" element={<div>Nhật ký hoạt động</div>} />
              {/* Manager routes */}
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="datasets" element={<div>Quản lý bộ dữ liệu</div>} />
              <Route path="labels" element={<div>Thiết lập bộ nhãn</div>} />
              <Route path="assignments" element={<div>Phân công công việc</div>} />
              {/* Annotator routes */}
              <Route path="tasks" element={<TaskList userRole="annotator" />} />
              <Route path="labeling" element={<div>Gán nhãn</div>} />
              {/* Reviewer routes */}
              <Route path="review" element={<TaskList userRole="reviewer" />} />
              <Route path="review-history" element={<div>Lịch sử kiểm duyệt</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    );
  }

  return <Login onSwitchToRegister={() => setCurrentPage('register')} onLogin={handleLogin} />;
}

export default App;