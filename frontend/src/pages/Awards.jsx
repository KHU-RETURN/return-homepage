import { useEffect, useState } from 'react'
import { fetchAwards } from '../api/client.js'

export default function Awards() {
  const [awards, setAwards] = useState(null) // null = 로딩 중
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAwards().then(setAwards).catch((err) => setError(err.message))
  }, [])

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">AWARDS</p>
      <h1 className="mt-4 text-4xl font-bold">수상 내역</h1>

      <div className="mt-16">
        {error && <p className="text-error">{error}</p>}
        {!error && awards === null && <p className="text-gray-500">불러오는 중…</p>}
        {!error && awards?.length === 0 && (
          <p className="text-gray-500">등록된 수상 내역이 없습니다.</p>
        )}
        {awards?.length > 0 && (
          <ul className="divide-y divide-gray-300 border-y border-gray-300">
            {awards.map((award) => (
              <li key={award.id} className="grid gap-2 py-6 md:grid-cols-[140px_1fr_auto]">
                <span className="font-mono text-sm text-gray-500">
                  {award.awarded_on}
                </span>
                <div>
                  <p className="font-bold">
                    {award.competition} — {award.title}
                  </p>
                  {award.description && (
                    <p className="mt-1 text-sm text-gray-700">{award.description}</p>
                  )}
                </div>
                <span className="text-sm text-gray-700">{award.winners}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
