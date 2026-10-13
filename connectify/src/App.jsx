import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Import ProtectedRoute Component
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      {/* مكتبة التنبيهات والرسائل */}
      <Toaster position="top-right" />
          <Navbar />
      <Routes>
        {/* صفحات الـ Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* الصفحات المحمية (تتطلب تسجيل دخول) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* إعادة توجيه أي مسار خاطئ للـ Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}