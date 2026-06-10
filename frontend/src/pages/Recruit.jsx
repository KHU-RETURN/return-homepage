import { useState } from 'react'
import { submitApplication } from '../api/client.js'

const EMPTY = { name: '', student_id: '', phone: '', email: '', motivation: '' }

const fields = [
  { name: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
  { name: 'student_id', label: '학번', type: 'text', placeholder: '2026000000', mono: true },
  { name: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', mono: true },
  { name: 'email', label: '이메일', type: 'email', placeholder: 'you@khu.ac.kr' },
]

const guides = [
  {
    no: '01',
    title: '누가 지원할 수 있나요',
    body: '전공·학년 제한 없이 개발을 배우고 싶은 경희대학교 학생이라면 누구나 지원할 수 있습니다.',
  },
  {
    no: '02',
    title: '어떻게 진행되나요',
    body: '지원서를 제출하면 운영진이 확인 후 개별 연락드립니다.',
  },
  {
    no: '03',
    title: '궁금한 점이 있다면',
    body: '인스타그램 @khu_return으로 편하게 문의해주세요.',
  },
]

export default function Recruit() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    try {
      await submitApplication(form)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">RECRUIT</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        모집 · 지원
      </h1>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        {/* 모집 안내: 넘버드 리스트 */}
        <section>
          <ul className="divide-y divide-gray-300 border-y border-gray-300">
            {guides.map((guide) => (
              <li key={guide.no} className="flex gap-6 py-6">
                <span className="font-mono text-sm text-gray-500">
                  {guide.no}
                </span>
                <div>
                  <h2 className="font-bold">{guide.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {guide.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {status === 'done' ? (
          <div className="border border-success p-8">
            <p className="font-bold text-success">지원서가 제출되었습니다.</p>
            <p className="mt-2 text-sm text-gray-700">
              운영진 확인 후 입력하신 연락처로 안내드리겠습니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-bold">{field.label}</span>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  className={`mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none${field.mono ? ' font-mono' : ''}`}
                />
              </label>
            ))}
            <label className="block">
              <span className="text-sm font-bold">지원 동기</span>
              <textarea
                name="motivation"
                rows={5}
                placeholder="RETURN에서 무엇을 해보고 싶나요? (10자 이상)"
                value={form.motivation}
                onChange={handleChange}
                required
                minLength={10}
                className="mt-2 w-full rounded-sm border border-gray-300 bg-paper px-4 py-3 text-sm focus:border-ink focus:outline-none"
              />
            </label>
            {status === 'error' && <p className="text-sm text-error">{errorMessage}</p>}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-ink py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700 disabled:bg-gray-500"
            >
              {status === 'submitting' ? '제출 중…' : '지원서 제출'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
