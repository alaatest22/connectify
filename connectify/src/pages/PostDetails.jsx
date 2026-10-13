import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://linked-posts.routemisr.com';

// تغيير الـid يعيد تهيئة الصفحة وبياناتها
export default function PostDetails() {
const { id } = useParams();

if (!id) {
return (
<p className="p-6 text-center text-red-600">
معرّف المنشور غير موجود في الرابط.
</p>
);
}

return <PostDetailsContent key={id} id={id} />;
}

function PostDetailsContent({ id }) {
const [post, setPost] = useState(null);
const [comments, setComments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [commentText, setCommentText] = useState('');
const [commenting, setCommenting] = useState(false);

useEffect(() => {
const controller = new AbortController();

const config = {
headers: {
token: localStorage.getItem('userToken'),
},
signal: controller.signal,
};

Promise.all([
axios.get(`${API_URL}/posts/${id}`, config),
axios.get(`${API_URL}/posts/${id}/comments`, config),
])
.then(([postResponse, commentsResponse]) => {
if (controller.signal.aborted) return;

const fetchedPost = postResponse.data.post;

if (!fetchedPost) {
throw new Error('المنشور غير موجود');
}

setPost(fetchedPost);
setComments(commentsResponse.data.comments || []);
})
.catch((err) => {
if (controller.signal.aborted || axios.isCancel(err)) {
return;
}

const message =
err.response?.data?.error ||
err.response?.data?.message ||
err.message ||
'حدث خطأ أثناء تحميل المنشور';

setError(message);
})
.finally(() => {
if (!controller.signal.aborted) {
setLoading(false);
}
});

return () => controller.abort();
}, [id]);

async function handleAddComment(event) {
event.preventDefault();

const content = commentText.trim();

if (!content || commenting) return;

setCommenting(true);

const config = {
headers: {
token: localStorage.getItem('userToken'),
},
};

try {
await axios.post(
`${API_URL}/comments`,
{
content,
post: id,
},
config
);
} catch (err) {
toast.error(
err.response?.data?.error ||
err.response?.data?.message ||
'تعذّر إضافة التعليق'
);

setCommenting(false);
return;
}

setCommentText('');
toast.success('تم إضافة التعليق بنجاح');

// تحديث القائمة بعد نجاح الإضافة
try {
const { data } = await axios.get(
`${API_URL}/posts/${id}/comments`,
config
);

setComments(data.comments || []);
} catch {
toast.error(
'التعليق اتضاف، لكن تحديث القائمة فشل. حدّث الصفحة.'
);
} finally {
setCommenting(false);
}
}

if (loading) {
return (
<div
className="flex min-h-screen items-center justify-center"
role="status"
>
<p>جاري تحميل المنشور...</p>
</div>
);
}

if (error) {
return (
<div
dir="rtl"
className="p-6 text-center text-red-600"
role="alert"
>
{error}
</div>
);
}

if (!post) {
return (
<p className="p-6 text-center">
المنشور غير موجود.
</p>
);
}

return (
<main
dir="rtl"
className="min-h-screen bg-gray-100 px-4 py-8"
>
<div className="mx-auto max-w-2xl space-y-6">
<article className="rounded-xl bg-white p-5 shadow-sm">
<header className="flex items-center gap-3">
{post.user?.photo && (
<img
src={post.user.photo}
alt=""
className="h-12 w-12 rounded-full object-cover"
/>
)}

<div>
<h1 className="font-bold text-gray-800">
{post.user?.name || 'مستخدم'}
</h1>

{post.createdAt && (
<time
dateTime={post.createdAt}
className="text-sm text-gray-500"
>
{new Date(post.createdAt).toLocaleString('ar-EG')}
</time>
)}
</div>
</header>

{post.body && (
<p className="mt-4 whitespace-pre-wrap break-words text-gray-800">
{post.body}
</p>
)}

{post.image && (
<img
src={post.image}
alt="صورة المنشور"
className="mt-4 w-full rounded-lg"
/>
)}
</article>

<section className="rounded-xl bg-white p-5 shadow-sm">
<h2 className="mb-4 text-lg font-bold">
التعليقات
</h2>

<form onSubmit={handleAddComment} className="mb-6">
<label
htmlFor="comment"
className="mb-2 block text-sm font-medium"
>
أضف تعليقًا
</label>

<textarea
id="comment"
value={commentText}
onChange={(event) => setCommentText(event.target.value)}
placeholder="اكتب تعليقك هنا..."
rows={3}
required
disabled={commenting}
className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
/>

<button
type="submit"
disabled={commenting || !commentText.trim()}
className="mt-2 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
{commenting ? 'جاري الإرسال...' : 'إضافة تعليق'}
</button>
</form>

{comments.length === 0 ? (
<p className="text-center text-gray-500">
مفيش تعليقات لسه.
</p>
) : (
<div className="space-y-4">
{comments.map((comment) => (
<article
key={comment._id}
className="rounded-lg bg-gray-50 p-4"
>
<div className="flex items-center gap-3">
{comment.commentCreator?.photo && (
<img
src={comment.commentCreator.photo}
alt=""
loading="lazy"
className="h-9 w-9 rounded-full object-cover"
/>
)}

<div>
<h3 className="font-semibold">
{comment.commentCreator?.name || 'مستخدم'}
</h3>

{comment.createdAt && (
<time
dateTime={comment.createdAt}
className="text-xs text-gray-500"
>
{new Date(comment.createdAt).toLocaleString(
'ar-EG'
)}
</time>
)}
</div>
</div>

<p className="mt-3 whitespace-pre-wrap break-words text-gray-700">
{comment.content}
</p>
</article>
))}
</div>
)}
</section>
</div>
</main>
);
}