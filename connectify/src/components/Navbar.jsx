import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
          Connectify
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 space-x-reverse">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
            الرئيسية
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition">
            الصفحة الشخصية
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </nav>
  );
}