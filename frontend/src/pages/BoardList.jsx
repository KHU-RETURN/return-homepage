import { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { fetchPosts } from '../api/client.js'
import { BOARDS, BOARD_LABELS } from '../boards.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function BoardList() {
  const { board } = useParams()
  const { user } = useAuth()
  const [posts, setPosts] = useState(null) // null = 로딩 중
  const [error, setError] = useState(null) // {status, message}

  useEffect(() => {
    setPosts(null)
    setError(null)
    fetchPosts(board)
      .then(setPosts)
      .catch((err) => setError({ status: err.status, message: err.message }))
  }, [board])

  const needsLogin = error && (error.status === 401 || error.status === 403)
  // 공지는 운영진만, 질문/자료는 로그인한 회원이면 누구나 쓸 수 있다
  const canWrite = user && (board !== 'notice' || user.role === 'admin')

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">BOARD</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        게시판
      </h1>

      {/* 게시판 탭: 공유 보더 탭바, 활성 탭은 잉크 배경으로 반전 */}
      <div className="mt-12 grid grid-cols-3 gap-px border border-gray-300 bg-gray-300">
        {BOARDS.map((tab) => (
          <NavLink
            key={tab.key}
            to={`/board/${tab.key}`}
            className={({ isActive }) =>
              isActive
                ? 'bg-ink py-3 text-center text-sm font-bold text-paper'
                : 'bg-paper py-3 text-center text-sm transition-colors duration-100 hover:bg-gray-100'
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-8">
        {canWrite && (
          <div className="mb-4 flex justify-end">
            <Link
              to={`/board/${board}/write`}
              className="bg-ink px-6 py-2 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
            >
              글쓰기
            </Link>
          </div>
        )}

        {needsLogin && (
          <div className="border border-gray-300 p-12 text-center">
            <p className="font-bold">로그인이 필요한 게시판입니다.</p>
            <Link
              to="/login"
              state={{ from: `/board/${board}` }}
              className="mt-6 inline-block bg-ink px-8 py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
            >
              로그인
            </Link>
          </div>
        )}
        {error && !needsLogin && <p className="text-error">{error.message}</p>}
        {!error && posts === null && <p className="text-gray-500">불러오는 중…</p>}
        {posts?.length === 0 && (
          <p className="text-gray-500">
            등록된 {BOARD_LABELS[board] ?? ''} 글이 없습니다.
          </p>
        )}

        {posts?.length > 0 && (
          <div className="border-y border-gray-300">
            {/* 표 헤더 */}
            <div className="hidden grid-cols-[4rem_1fr_7rem_7rem_3rem] gap-4 border-b border-gray-300 py-3 font-mono text-xs text-gray-500 md:grid">
              <span>NO</span>
              <span>TITLE</span>
              <span>AUTHOR</span>
              <span>DATE</span>
              <span className="text-right">CMT</span>
            </div>
            <ul className="divide-y divide-gray-300">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/board/${board}/${post.id}`}
                    className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 transition-colors duration-100 hover:bg-gray-100 md:grid-cols-[4rem_1fr_7rem_7rem_3rem]"
                  >
                    <span className="hidden font-mono text-sm text-gray-500 md:block">
                      {post.id}
                    </span>
                    <span className="truncate text-sm font-bold">
                      {post.title}
                    </span>
                    <span className="hidden truncate text-sm text-gray-700 md:block">
                      {post.author_name}
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      {post.created_at?.slice(0, 10)}
                    </span>
                    <span className="hidden text-right font-mono text-xs text-gray-500 md:block">
                      {post.comment_count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
