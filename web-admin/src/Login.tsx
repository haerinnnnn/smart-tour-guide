import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // State điều khiển hiệu ứng trượt panel
  const [isRightPanelActive, setIsRightPanelActive] = useState<boolean>(false);

  // States cho Form Đăng nhập
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMsg, setLoginErrorMsg] = useState('');

  // States cho Form Đăng ký
  const [signupUsername, setSignupUsername] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupErrorMsg, setSignupErrorMsg] = useState('');
  const [signupSuccessMsg, setSignupSuccessMsg] = useState('');

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userInfo', JSON.stringify({
          user_id: data.user_id || data.id, 
          full_name: data.full_name,
          username: data.username
        }));
        // Chuyển hướng vào trang quản lý sau khi đăng nhập thành công
        navigate('/artifacts'); 
      } else {
        setLoginErrorMsg(data.error || 'Sai thông tin đăng nhập');
        setLoginPassword('');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setLoginErrorMsg('Không thể kết nối đến server. Vui lòng thử lại sau.');
    }
  };

  // --- XỬ LÝ ĐĂNG KÝ ---
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupErrorMsg('');
    setSignupSuccessMsg('');

    if (!signupUsername || !signupFullName || !signupPassword) {
      setSignupErrorMsg('Vui lòng điền đủ tên đăng nhập, họ tên và mật khẩu.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          full_name: signupFullName,
          phone: signupPhone || null
        })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setSignupSuccessMsg(data.message || 'Đăng ký thành công. Mời đăng nhập.');
        // Tự động trượt về trang đăng nhập sau 0.8s
        setTimeout(() => {
          setIsRightPanelActive(false);
          setSignupUsername('');
          setSignupFullName('');
          setSignupPhone('');
          setSignupPassword('');
        }, 800);
      } else {
        setSignupErrorMsg(data.error || 'Đăng ký thất bại.');
      }
    } catch (err) {
      console.error(err);
      setSignupErrorMsg('Không kết nối được máy chủ.');
    }
  };

  return (
    <div className={`login-page-wrapper ${isRightPanelActive ? 'register-mode' : ''}`}>
      <div className={`login-container ${isRightPanelActive ? 'active' : ''}`} id="container">
        
        {/* FORM ĐĂNG KÝ (SIGN UP) */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignupSubmit} noValidate>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span></span>
            
            <div className="field">
              <input type="text" required placeholder=" " value={signupUsername} 
                onChange={(e) => { setSignupUsername(e.target.value); setSignupErrorMsg(''); }} />
              <label>Tên đăng nhập</label>
            </div>
            <div className="field">
              <input type="text" required placeholder=" " value={signupFullName} 
                onChange={(e) => { setSignupFullName(e.target.value); setSignupErrorMsg(''); }} />
              <label>Họ và tên</label>
            </div>
            <div className="field">
              <input type="tel" placeholder=" " value={signupPhone} 
                onChange={(e) => { setSignupPhone(e.target.value); setSignupErrorMsg(''); }} />
              <label>Số điện thoại (tuỳ chọn)</label>
            </div>
            <div className="field">
              <input type="password" required placeholder=" " autoComplete="off" value={signupPassword} 
                onChange={(e) => { setSignupPassword(e.target.value); setSignupErrorMsg(''); }} />
              <label>Mật khẩu</label>
            </div>

            {signupErrorMsg && <p style={{ color: '#e74c3c', margin: '8px 0', fontSize: '14px' }}>{signupErrorMsg}</p>}
            {signupSuccessMsg && <p style={{ color: '#1e8e3e', margin: '8px 0', fontSize: '14px' }}>{signupSuccessMsg}</p>}
            
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* FORM ĐĂNG NHẬP (SIGN IN) */}
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit} noValidate>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span></span>
            
            <div className="field">
              <input type="text" required placeholder=" " value={loginUsername} 
                onChange={(e) => { setLoginUsername(e.target.value); setLoginErrorMsg(''); }} />
              <label>Tên đăng nhập</label>
            </div>
            <div className="field">
              <input type="password" required placeholder=" " value={loginPassword} 
                onChange={(e) => { setLoginPassword(e.target.value); setLoginErrorMsg(''); }} />
              <label>Mật khẩu</label>
            </div>

            {loginErrorMsg && <p style={{ color: '#e74c3c', margin: '5px 0', fontSize: '14px' }}>{loginErrorMsg}</p>}
            
            <a href="#">Quên mật khẩu à?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* PANEL TRƯỢT OVERLAY */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Chào mừng!</h1>
              <p>Bạn đã có tài khoản? Đăng nhập ngay!</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Chào mừng!</h1>
              <p>Bạn chưa có tài khoản? Đăng ký ngay!</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;