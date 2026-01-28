import { useState } from 'react';
import './App.css';
import Register from './Register';

function Login({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
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
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  if (currentPage === 'register') {
    return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
  }

  return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
}

export default App;