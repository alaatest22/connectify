
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('userToken');

  // لو مفيش توكن، وجه المستخدم لصفحة تسجيل الدخول فوراً
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}