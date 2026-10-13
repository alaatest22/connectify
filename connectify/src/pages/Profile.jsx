import { useEffect, useState } from 'react';

import axios from 'axios';

import toast from 'react-hot-toast';

export default function Profile() {

  const [userPosts, setUserPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const controller = new AbortController();

    const token = localStorage.getItem('userToken');

    axios

      .get(

        'https://linked-posts.routemisr.com/users/660c32933f30570879226c1f/posts?limit=20',

        {

          headers: { token },

          signal: controller.signal,

        }

      )

      .then(({ data }) => {

        if (!controller.signal.aborted) {setUserPosts(data.posts || []);

        }

      })

      .catch((error) => {

        if (controller.signal.aborted || axios.isCancel(error)) {

          return;

        }

        toast.error('حدث خطأ أثناء تحميل منشوراتك');

      })

      .finally(() => {

        if (!controller.signal.aborted) {

          setLoading(false);

        }

      });

    return () => {

      controller.abort();

    };

  }, []);

  const handleDeletePost = async (postId) => {

    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {

      return;}

    try {

      const token = localStorage.getItem('userToken');

      await axios.delete(

        `https://linked-posts.routemisr.com/posts/${postId}`,

        {

          headers: { token },

        }

      );

      setUserPosts((posts) =>

        posts.filter((post) => post._id !== postId)

      );

      toast.success('تم حذف المنشور بنجاح');

    } catch {

      toast.error('حدث خطأ أثناء حذف المنشور');

    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium">جاري تحميل الصفحة الشخصية...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* هيدر البروفايل */}
      <div className="bg-white p-6 rounded-lg shadow text-center space-y-3">
        <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-2 border-blue-500">
          👤
        </div>
        <h2 className="text-xl font-bold text-gray-800">صفحتي الشخصية</h2>
        <p className="text-sm text-gray-500">جميع منشوراتي وتفاعلاتي</p>
      </div>

      {/* قائمة المنشورات مع خيار الحذف */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 text-lg">منشوراتي</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post._id} className="bg-white p-5 rounded-lg shadow space-y-3 relative">
              <div className="flex justify-between items-start">
                <p className="text-gray-800 whitespace-pre-line flex-1">{post.body}</p>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold mr-2 transition"
                >
                  حذف
                </button>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full max-h-80 object-cover rounded-md"
                />
              )}
              <div className="text-xs text-gray-400 border-t pt-2">
                تم النشر بتاريخ: {new Date(post.createdAt).toLocaleDateString('ar-EG')}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            لم تقم بنشر أي منشورات بعد.
          </div>
        )}
      </div>
    </div>
  );
}