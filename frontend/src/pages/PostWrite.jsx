import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createPost, uploadFile } from '../api/client.js'
import { BOARD_LABELS } from '../boards.js'
import { useAuth } from '../auth/AuthContext.jsx'

export default function PostWrite() {
  const { board } = useParams()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null) // 자료 게시판 전용
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 비로그인이면 로그인 페이지로 (로그인 후 다시 돌아온다)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [loading, user, navigate, location.pathname])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const post = await createPost({ board, title, content })
      // 자료 게시판: 글 저장 후 선택된 파일이 있으면 이어서 업로드
      if (board === 'resource' && file) {
        await uploadFile(post.id, file)
      }
      navigate(`/board/${board}/${post.id}`)
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { state: { from: location.pathname } })
        return
      }
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">WRITE</p>
      <h1 className="mt-4 text-3xl font-bold">
        {BOARD_LABELS[board] ?? '게시판'} 글쓰기
      </h1>

      <form onSubmit={handleSubmit} className="mt-12 max-w-[720px] space-y-6">
        <label className="block">
          <span className="text-sm font-bold">제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold">내용</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            required
            className="mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        {board === 'resource' && (
          <label className="block">
            <span className="text-sm font-bold">첨부파일 (선택)</span>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files[0] ?? null)}
              className="mt-2 block w-full font-mono text-sm"
            />
          </label>
        )}
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-ink px-8 py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700 disabled:bg-gray-500"
          >
            {submitting ? '저장 중…' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/board/${board}`)}
            className="border border-ink px-8 py-3 text-sm font-bold transition-colors duration-100 hover:bg-gray-100"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
