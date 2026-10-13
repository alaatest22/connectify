import { useState } from 'react';import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('https://linked-posts.routemisr.com/users/signin', formData);
      if (data.message === 'success') {
        localStorage.setItem('userToken', data.token);
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="البريد الإلكتروني" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="كلمة السر" onChange={handleChange} required className="w-full p-2 border rounded" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ليس لديك حساب؟ <Link to="/signup" className="text-blue-600 font-bold">إنشاء حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}