import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchPost, updatePost } from '../api/client.js'
import { BOARD_LABELS } from '../boards.js'

export default function PostEdit() {
  const { board, id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost(id)
      .then((post) => {
        setTitle(post.title)
        setContent(post.content)
        setLoaded(true)
      })
      .catch((err) => {
        if (err.status === 401) {
          navigate('/login', { state: { from: location.pathname } })
          return
        }
        setError(err.message)
      })
  }, [id, navigate, location.pathname])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await updatePost(id, { title, content })
      navigate(`/board/${board}/${id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">EDIT</p>
      <h1 className="mt-4 text-3xl font-bold">
        {BOARD_LABELS[board] ?? '게시판'} 글 수정
      </h1>

      {error && <p className="mt-8 text-sm text-error">{error}</p>}
      {!loaded && !error && <p className="mt-8 text-gray-500">불러오는 중…</p>}

      {loaded && (
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
              onClick={() => navigate(`/board/${board}/${id}`)}
              className="border border-ink px-8 py-3 text-sm font-bold transition-colors duration-100 hover:bg-gray-100"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
