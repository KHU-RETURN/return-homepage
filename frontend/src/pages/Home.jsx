import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAwards, fetchPosts } from '../api/client.js'
import Marquee from '../components/Marquee.jsx'

// 활동 프리뷰는 정적 텍스트. 실제 목록은 /activities에서 DB로 불러온다.
const activityPreviews = [
  {
    no: '01',
    title: '스터디',
    body: '언어·CS·웹 개발까지, 학기마다 열리는 단계별 스터디.',
  },
  {
    no: '02',
    title: '소모임',
    body: '관심사가 맞는 사람끼리 모여 만들고 부수는 작은 팀.',
  },
  {
    no: '03',
    title: 'MT · 행사',
    body: '개강총회부터 MT까지, 코드 밖에서도 함께합니다.',
  },
]

export default function Home() {
  const [recentNotices, setRecentNotices] = useState([])
  const [recentAwards, setRecentAwards] = useState([])

  useEffect(() => {
    fetchPosts('notice')
      .then((posts) => setRecentNotices(posts.slice(0, 3)))
      .catch(() => setRecentNotices([]))
    fetchAwards()
      .then((awards) => setRecentAwards(awards.slice(0, 3)))
      .catch(() => setRecentAwards([]))
  }, [])

  return (
    <div>
      {/* 다크 히어로: 잉크 풀블리드 + 거대 워드마크 */}
      <section className="relative flex min-h-[85vh] flex-col justify-center overflow-hidden bg-ink text-paper">
        <img
          src="/return-logo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 w-[560px] -translate-y-1/2 opacity-10"
        />
        <div className="relative mx-auto w-full max-w-[1120px] px-6 py-24">
          <p className="font-mono text-sm text-gray-300">
            SINCE 1988 — 경희대학교 컴퓨터공학부 학술동아리
          </p>
          <h1 className="mt-4 font-display text-[clamp(4rem,14vw,12rem)] font-bold leading-none tracking-tight">
            RETURN
          </h1>
          <p className="mt-10 max-w-[720px] text-xl leading-relaxed text-gray-300">
            함께 공부하고, 만들고, 출전합니다.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/recruit"
              className="bg-paper px-8 py-3 text-sm font-bold text-ink transition-colors duration-100 hover:bg-gray-300"
            >
              입부 지원하기
            </Link>
            <Link
              to="/about"
              className="border border-paper px-8 py-3 text-sm font-bold text-paper transition-colors duration-100 hover:bg-paper hover:text-ink"
            >
              동아리 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* 마퀴 스트립: 히어로와 본문의 경계 장식 */}
      <Marquee />

      {/* 활동 프리뷰: 넘버드 그리드 (공유 보더) */}
      <section className="mx-auto max-w-[1120px] px-6 py-24">
        <h2 className="font-mono text-sm text-gray-500">ACTIVITIES</h2>
        <div className="mt-6 grid gap-px border border-gray-300 bg-gray-300 md:grid-cols-3">
          {activityPreviews.map((item) => (
            <Link
              key={item.no}
              to="/activities"
              className="group bg-paper p-8 transition-colors duration-100 hover:bg-gray-100"
            >
              <span className="font-mono text-sm text-gray-500">{item.no}</span>
              <h3 className="mt-6 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {item.body}
              </p>
              <span className="mt-6 inline-block text-sm underline underline-offset-4">
                더 보기 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 공지 + 최근 수상: 2컬럼 리스트 */}
      <section className="mx-auto grid max-w-[1120px] gap-16 px-6 pb-24 md:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-sm text-gray-500">RECENT NOTICES</h2>
            <Link
              to="/board/notice"
              className="text-sm underline underline-offset-4"
            >
              전체 보기
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gray-300 border-y border-gray-300">
            {recentNotices.length === 0 && (
              <li className="py-4 text-sm text-gray-500">공지가 없습니다.</li>
            )}
            {recentNotices.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/board/notice/${post.id}`}
                  className="flex items-baseline gap-4 py-4 transition-colors duration-100 hover:bg-gray-100"
                >
                  <span className="shrink-0 font-mono text-xs text-gray-500">
                    {post.created_at?.slice(0, 10)}
                  </span>
                  <span className="truncate text-sm font-bold">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-sm text-gray-500">RECENT AWARDS</h2>
            <Link to="/awards" className="text-sm underline underline-offset-4">
              전체 보기
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-gray-300 border-y border-gray-300">
            {recentAwards.length === 0 && (
              <li className="py-4 text-sm text-gray-500">
                수상 내역이 없습니다.
              </li>
            )}
            {recentAwards.map((award) => (
              <li key={award.id} className="flex items-baseline gap-4 py-4">
                <span className="shrink-0 font-mono text-xs text-gray-500">
                  {award.awarded_on}
                </span>
                <span className="truncate text-sm font-bold">
                  {award.competition} — {award.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 반전 CTA 섹션 */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <p className="font-mono text-sm text-gray-500">JOIN US</p>
          <h2 className="mt-4 max-w-[720px] font-display text-4xl font-bold leading-tight md:text-5xl">
            RETURN과 함께
            <br />
            성장할 사람을 찾습니다
          </h2>
          <Link
            to="/recruit"
            className="mt-10 inline-block bg-paper px-8 py-3 text-sm font-bold text-ink transition-colors duration-100 hover:bg-gray-300"
          >
            입부 지원하기
          </Link>
        </div>
      </section>
    </div>
  )
}
