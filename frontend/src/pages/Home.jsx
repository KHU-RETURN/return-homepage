import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAwards } from '../api/client.js'

export default function Home() {
  const [recentAwards, setRecentAwards] = useState([])

  useEffect(() => {
    fetchAwards()
      .then((awards) => setRecentAwards(awards.slice(0, 3)))
      .catch(() => setRecentAwards([]))
  }, [])

  return (
    <div className="relative overflow-hidden">
      <img
        src="/return-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-12 w-[480px] opacity-[0.06]"
      />
      <section className="mx-auto max-w-[1120px] px-6 py-24">
        <p className="font-mono text-sm text-gray-500">SINCE 1988</p>
        <h1 className="mt-4 font-display text-7xl font-bold tracking-tight">
          RETURN
        </h1>
        <p className="mt-8 max-w-[720px] text-xl leading-relaxed text-gray-700">
          경희대학교 컴퓨터공학부 학술동아리.
          <br />
          함께 공부하고, 만들고, 출전합니다.
        </p>
        <div className="mt-12 flex gap-4">
          <Link
            to="/recruit"
            className="bg-ink px-8 py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
          >
            입부 지원하기
          </Link>
          <Link
            to="/about"
            className="border border-ink px-8 py-3 text-sm font-bold transition-colors duration-100 hover:bg-gray-100"
          >
            동아리 알아보기
          </Link>
        </div>
      </section>

      {recentAwards.length > 0 && (
        <section className="mx-auto max-w-[1120px] px-6 pb-24">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-sm text-gray-500">RECENT AWARDS</h2>
            <Link to="/awards" className="text-sm underline underline-offset-4">
              전체 보기
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gray-300 border-y border-gray-300">
            {recentAwards.map((award) => (
              <li key={award.id} className="flex gap-6 py-4">
                <span className="font-mono text-sm text-gray-500">
                  {award.awarded_on}
                </span>
                <span className="text-sm font-bold">
                  {award.competition} — {award.title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
