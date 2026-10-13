import { useEffect, useState } from 'react';

import axios from 'axios';

import toast from 'react-hot-toast';

const API_URL = 'https://linked-posts.routemisr.com';

export default function Home() {

  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {

    const controller = new AbortController();

    async function getPosts() {

      try {

        const token = localStorage.getItem('userToken');

        const config = {

          headers: { token },

          signal: controller.signal,

        };

        const [postsResponse, userResponse] = await Promise.all([

          axios.get(`${API_URL}/posts?limit=50`, config),

          axios.get(`${API_URL}/users/profile-data`, config),

        ]);

        if (controller.signal.aborted) return;
        setPosts(postsResponse.data.posts || []);

        setUser(userResponse.data.user);

      } catch (err) {

        if (controller.signal.aborted || axios.isCancel(err)) return;

        setError(

          err.response?.status === 401

            ? 'سجّل الدخول تاني عشان تقدر تشوف البوستات'

            : err.response?.data?.error ||

                err.response?.data?.message ||

                'حصل خطأ أثناء تحميل البوستات'

        );

      } finally {

        if (!controller.signal.aborted) {

          setLoading(false);

        }

      }

    }

    getPosts();

    return () => {

      controller.abort();

    };

  }, []);

  async function handleDeletePost(postId) {

    if (deletingId) return;

    const confirmed = window.confirm(

      'هل أنت متأكد من حذف المنشور؟'

    );

    if (!confirmed) return;
    setDeletingId(postId);

    try {

      const token = localStorage.getItem('userToken');

      await axios.delete(`${API_URL}/posts/${postId}`, {

        headers: { token },

      });

      setPosts((currentPosts) =>

        currentPosts.filter((post) => post._id !== postId)

      );

      toast.success('تم حذف المنشور بنجاح');

    } catch (err) {

      toast.error(

        err.response?.data?.error ||

          err.response?.data?.message ||

          'حصل خطأ أثناء حذف المنشور'

      );

    } finally {

      setDeletingId(null);
      }

  }

  if (loading) {

    return (

      <p dir="rtl" role="status" style={{ textAlign: 'center' }}>

        جاري تحميل البوستات...

      </p>

    );

  }

  if (error) {

    return (

      <p dir="rtl" role="alert" style={{ textAlign: 'center' }}>

        {error}

      </p>

    );

  }

  return (

    <main

      dir="rtl"

      style={{

        maxWidth: '650px',

        margin: '30px auto',

        padding: '0 16px',

      }}

    >

      <h1>الصفحة الرئيسية</h1>

      {posts.length === 0 ? (

        <p>مفيش بوستات لسه.</p>

      ) : (

        posts.map((post) => {

          const authorId =

            typeof post.user === 'string'

              ? post.user

              : post.user?._id;

          const isOwner = Boolean(

            user?._id && authorId === user._id

          );

          return (

            <article
            key={post._id}

              style={{

                border: '1px solid #ddd',

                borderRadius: '12px',

                padding: '20px',

                marginBottom: '20px',

              }}

            >

              <header

                style={{

                  display: 'flex',

                  alignItems: 'center',

                  gap: '12px',

                }}

              >

                {post.user?.photo && (

                  <img

                    src={post.user.photo}

                    alt=""

                    width={44}

                    height={44}

                    style={{

                      borderRadius: '50%',

                      objectFit: 'cover',

                    }}

                  />

                )}

                <div>

                  <strong>

                    {post.user?.name || 'مستخدم'}

                  </strong>
                  {post.createdAt && (

                    <div>

                      <time dateTime={post.createdAt}>

                        {new Date(post.createdAt).toLocaleString(

                          'ar-EG'

                        )}

                      </time>

                    </div>

                  )}

                </div>

              </header>

              {post.body && (

                <p

                  style={{

                    whiteSpace: 'pre-wrap',

                    overflowWrap: 'anywhere',
                    }}

                >

                  {post.body}

                </p>

              )}

              {post.image && (

                <img

                  src={post.image}

                  alt="صورة المنشور"

                  loading="lazy"

                  style={{

                    display: 'block',

                    width: '100%',

                    borderRadius: '8px',

                    marginTop: '12px',
                    }}

                />

              )}

              {isOwner && (

                <button

                  type="button"

                  onClick={() => handleDeletePost(post._id)}

                  disabled={deletingId !== null}

                  style={{ marginTop: '16px' }}

                >

                  {deletingId === post._id

                    ? 'جاري الحذف...'

                    : 'حذف المنشور'}

                </button>

              )}

            </article>

          );

        })

      )}

    </main>

  );

}