import { useState } from 'react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

function Register({ onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { email, password, confirmPassword, agreeTerms });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Đăng kí</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="designer@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
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
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a> của các bạn
            </label>
          </div>

          <button type="submit" className="login-btn">Tạo tài khoản</button>
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
          Đã có tài khoản ? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
