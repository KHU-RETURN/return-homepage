import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchMyPosts } from '../api/client.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function MyPage() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState(null) // null = 로딩 중
  const [error, setError] = useState('')

  // 비로그인이면 로그인 페이지로
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/mypage' } })
    }
  }, [loading, user, navigate])

  useEffect(() => {
    if (!user) return
    fetchMyPosts()
      .then(setMyPosts)
      .catch((err) => setError(err.message))
  }, [user])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  if (!user) return null // 리다이렉트 대기 중

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">MY PAGE</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        마이페이지
      </h1>

      {/* 내 정보 */}
      <section className="mt-16 max-w-[720px]">
        <h2 className="font-mono text-sm text-gray-500">PROFILE</h2>
        <dl className="mt-2 divide-y divide-gray-300 border-y border-gray-300">
          <div className="grid grid-cols-[7rem_1fr] py-4">
            <dt className="text-sm text-gray-700">이름</dt>
            <dd className="text-sm font-bold">{user.name}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] py-4">
            <dt className="text-sm text-gray-700">학번</dt>
            <dd className="font-mono text-sm">{user.student_id}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] py-4">
            <dt className="text-sm text-gray-700">승인 상태</dt>
            <dd className="text-sm font-bold">
              {user.is_approved ? '승인 완료' : '운영진 승인 대기 중'}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 border border-ink px-8 py-3 text-sm font-bold transition-colors duration-100 hover:bg-gray-100"
        >
          로그아웃
        </button>
      </section>

      {/* 내가 쓴 글 */}
      <section className="mt-20 max-w-[720px]">
        <h2 className="font-mono text-sm text-gray-500">MY POSTS</h2>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
        {!error && myPosts === null && (
          <p className="mt-2 text-sm text-gray-500">불러오는 중…</p>
        )}
        {myPosts?.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">아직 쓴 글이 없습니다.</p>
        )}
        {myPosts?.length > 0 && (
          <ul className="mt-2 divide-y divide-gray-300 border-y border-gray-300">
            {myPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/board/${post.board}/${post.id}`}
                  className="flex items-baseline gap-4 py-4 transition-colors duration-100 hover:bg-gray-100"
                >
                  <span className="shrink-0 font-mono text-xs text-gray-500">
                    {post.created_at?.slice(0, 10)}
                  </span>
                  <span className="truncate text-sm font-bold">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
