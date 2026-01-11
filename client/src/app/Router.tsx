import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MapPage } from '../pages/MapPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { useAuthStore } from '../store/auth.store';
import { Modal } from '../components/ui/Modal';

const AuthModalWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const isLoginOpen = location.pathname === '/login';
  const isRegisterOpen = location.pathname === '/register';

  if (token && (isLoginOpen || isRegisterOpen)) {
    return <Navigate to="/" />;
  }

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <MapPage />
      
      <Modal open={isLoginOpen} onClose={handleClose}>
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>
          <LoginPage />
        </div>
      </Modal>

      <Modal open={isRegisterOpen} onClose={handleClose}>
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Create Account</h2>
          <RegisterPage />
        </div>
      </Modal>
    </>
  );
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthModalWrapper />} />
        <Route path="/login" element={<AuthModalWrapper />} />
        <Route path="/register" element={<AuthModalWrapper />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};
