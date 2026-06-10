import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../api/client.js'

const EMPTY = { username: '', password: '', name: '', student_id: '' }

const fields = [
  { name: 'username', label: '아이디', type: 'text', autoComplete: 'username' },
  { name: 'password', label: '비밀번호', type: 'password', autoComplete: 'new-password' },
  { name: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
  { name: 'student_id', label: '학번', type: 'text', placeholder: '2026000000', mono: true },
]

export default function Signup() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | submitting | done
  const [error, setError] = useState('')

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await signup(form)
      setStatus('done')
    } catch (err) {
      setStatus('idle')
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">SIGNUP</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        회원가입
      </h1>

      {status === 'done' ? (
        <div className="mt-16 max-w-[400px] border border-success p-8">
          <p className="font-bold text-success">가입 완료!</p>
          <p className="mt-2 text-sm text-gray-700">
            운영진 승인 후 로그인할 수 있습니다.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block bg-ink px-8 py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
          >
            로그인으로
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-16 max-w-[400px] space-y-6">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="text-sm font-bold">{field.label}</span>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={handleChange}
                required
                className={`mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none${field.mono ? ' font-mono' : ''}`}
              />
            </label>
          ))}
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-ink py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700 disabled:bg-gray-500"
          >
            {status === 'submitting' ? '가입 중…' : '가입하기'}
          </button>
          <p className="text-sm text-gray-700">
            이미 계정이 있다면{' '}
            <Link to="/login" className="underline underline-offset-4">
              로그인
            </Link>
          </p>
        </form>
      )}
    </div>
  )
}
