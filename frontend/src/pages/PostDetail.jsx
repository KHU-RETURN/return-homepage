import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  createComment,
  deleteComment,
  deletePost,
  fetchPost,
} from '../api/client.js'
import { BOARD_LABELS } from '../boards.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function PostDetail() {
  const { board, id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [post, setPost] = useState(null) // null = 로딩 중
  const [error, setError] = useState(null)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')

  async function load() {
    try {
      setPost(await fetchPost(id))
    } catch (err) {
      if (err.status === 401) {
        // 로그인 후 이 글로 돌아올 수 있게 현재 경로를 넘긴다
        navigate('/login', { state: { from: location.pathname } })
        return
      }
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // 글쓴이 본인이거나 운영진이면 수정·삭제 가능
  const canEdit = user && post && (user.id === post.author_id || user.role === 'admin')

  async function handleDeletePost() {
    if (!window.confirm('이 글을 삭제할까요?')) return
    try {
      await deletePost(post.id)
      navigate(`/board/${board}`)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmitComment(event) {
    event.preventDefault()
    setCommentError('')
    try {
      await createComment(post.id, comment)
      setComment('')
      await load()
    } catch (err) {
      setCommentError(err.message)
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('이 댓글을 삭제할까요?')) return
    try {
      await deleteComment(commentId)
      await load()
    } catch (err) {
      setCommentError(err.message)
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <p className="text-error">{error}</p>
      </div>
    )
  }
  if (post === null) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-24">
        <p className="text-gray-500">불러오는 중…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <Link
        to={`/board/${board}`}
        className="font-mono text-sm text-gray-500 underline underline-offset-4"
      >
        ← {BOARD_LABELS[board] ?? '게시판'} 목록
      </Link>

      <h1 className="mt-8 text-3xl font-bold">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-300 pb-6">
        <span className="text-sm font-bold">{post.author_name}</span>
        <span className="font-mono text-xs text-gray-500">
          {post.created_at?.slice(0, 10)}
        </span>
        {canEdit && (
          <span className="ml-auto flex gap-4 text-sm">
            <Link
              to={`/board/${board}/${post.id}/edit`}
              className="underline underline-offset-4"
            >
              수정
            </Link>
            <button
              type="button"
              onClick={handleDeletePost}
              className="text-error underline underline-offset-4"
            >
              삭제
            </button>
          </span>
        )}
      </div>

      <div className="mt-8 max-w-[720px] whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      {post.attachments?.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-sm text-gray-500">ATTACHMENTS</h2>
          <ul className="mt-2 divide-y divide-gray-300 border-y border-gray-300">
            {post.attachments.map((file) => (
              <li key={file.id}>
                <a
                  href={`/api/files/${file.id}`}
                  className="block py-3 font-mono text-sm underline underline-offset-4 transition-colors duration-100 hover:bg-gray-100"
                >
                  ↓ {file.filename}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-mono text-sm text-gray-500">
          COMMENTS ({post.comments?.length ?? 0})
        </h2>
        <ul className="mt-2 divide-y divide-gray-300 border-y border-gray-300">
          {post.comments?.length === 0 && (
            <li className="py-4 text-sm text-gray-500">아직 댓글이 없습니다.</li>
          )}
          {post.comments?.map((c) => (
            <li key={c.id} className="py-4">
              <div className="flex items-baseline gap-4">
                <span className="text-sm font-bold">{c.author_name}</span>
                <span className="font-mono text-xs text-gray-500">
                  {c.created_at?.slice(0, 10)}
                </span>
                {user && (user.id === c.author_id || user.role === 'admin') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(c.id)}
                    className="ml-auto text-xs text-error underline underline-offset-4"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {c.content}
              </p>
            </li>
          ))}
        </ul>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mt-6 space-y-3">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              required
              placeholder="댓글을 입력하세요"
              className="w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
            {commentError && <p className="text-sm text-error">{commentError}</p>}
            <button
              type="submit"
              className="bg-ink px-6 py-2 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
            >
              댓글 작성
            </button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-gray-500">
            댓글을 쓰려면{' '}
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="underline underline-offset-4"
            >
              로그인
            </Link>
            이 필요합니다.
          </p>
        )}
      </section>
    </div>
  )
}
