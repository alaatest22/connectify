import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    dateOfBirth: '',
    gender: 'female'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('https://linked-posts.routemisr.com/users/signup', formData);
      if (data.message === 'success') {
        toast.success('تم إنشاء الحساب بنجاح!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">إنشاء حساب جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="الاسم الكامل" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="البريد الإلكتروني" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="كلمة السر" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="password" name="rePassword" placeholder="تأكيد كلمة السر" onChange={handleChange} required className="w-full p-2 border rounded" />
          <input type="date" name="dateOfBirth" onChange={handleChange} required className="w-full p-2 border rounded" />
          <select name="gender" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="female">أنثى</option>
            <option value="male">ذكر</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {loading ? 'جاري التسجيل...' : 'تسجيل حساب'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 font-bold">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}