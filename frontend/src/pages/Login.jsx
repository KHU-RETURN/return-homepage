import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/' // 로그인 후 돌아갈 곳

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      // 403이면 서버가 "운영진 승인 대기 중입니다"를 보내준다
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">LOGIN</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        로그인
      </h1>

      <form onSubmit={handleSubmit} className="mt-16 max-w-[400px] space-y-6">
        <label className="block">
          <span className="text-sm font-bold">아이디</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
            className="mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700 disabled:bg-gray-500"
        >
          {submitting ? '로그인 중…' : '로그인'}
        </button>
        <p className="text-sm text-gray-700">
          아직 계정이 없다면{' '}
          <Link to="/signup" className="underline underline-offset-4">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  )
}
