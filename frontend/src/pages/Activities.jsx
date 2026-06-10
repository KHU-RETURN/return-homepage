import { useEffect, useState } from 'react'
import { fetchActivities } from '../api/client.js'

// kind 값과 화면 표기·순서 정의
const KINDS = [
  { key: 'study', no: '01', label: '스터디' },
  { key: 'group', no: '02', label: '소모임' },
  { key: 'mt', no: '03', label: 'MT · 행사' },
]

export default function Activities() {
  const [activities, setActivities] = useState(null) // null = 로딩 중
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchActivities().then(setActivities).catch((err) => setError(err.message))
  }, [])

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">ACTIVITIES</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
        활동
      </h1>

      {error && <p className="mt-16 text-error">{error}</p>}
      {!error && activities === null && (
        <p className="mt-16 text-gray-500">불러오는 중…</p>
      )}

      {activities &&
        KINDS.map((kind) => {
          const items = activities.filter((a) => a.kind === kind.key)
          return (
            <section key={kind.key} className="mt-20">
              <div className="flex items-baseline gap-6 border-b border-ink pb-4">
                <span className="text-outline font-display text-5xl font-bold text-ink">
                  {kind.no}
                </span>
                <h2 className="text-2xl font-bold">{kind.label}</h2>
              </div>
              {items.length === 0 ? (
                <p className="mt-6 text-sm text-gray-500">
                  등록된 활동이 없습니다.
                </p>
              ) : (
                <div className="mt-6 grid gap-px border border-gray-300 bg-gray-300 md:grid-cols-3">
                  {items.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-paper p-8 transition-colors duration-100 hover:bg-gray-100"
                    >
                      <h3 className="text-lg font-bold">{activity.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-700">
                        {activity.description}
                      </p>
                      {activity.semester && (
                        <p className="mt-6 font-mono text-xs text-gray-500">
                          {activity.semester}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
    </div>
  )
}
