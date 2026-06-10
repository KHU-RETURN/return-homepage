// 매 학기 모집을 시작할 때 이 주소만 새 구글 폼 링크로 바꾸면 된다
const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/1WXKfDKOe_pEl4Ygr_SfhIdI9kV0jpBm5iP-gsQsk5h4/viewform'

const guides = [
  {
    no: '01',
    title: '누가 지원할 수 있나요',
    body: '전공·학년 제한 없이 개발을 배우고 싶은 경희대학교 학생이라면 누구나 지원할 수 있습니다.',
  },
  {
    no: '02',
    title: '어떻게 진행되나요',
    body: '구글 폼으로 지원서를 제출하면 운영진이 확인 후 개별 연락드립니다.',
  },
  {
    no: '03',
    title: '궁금한 점이 있다면',
    body: '인스타그램 @khu_return으로 편하게 문의해주세요.',
  },
]

export default function Recruit() {
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

        {/* 지원: 구글 폼으로 연결 */}
        <section className="flex flex-col justify-between border border-ink p-8">
          <div>
            <p className="font-mono text-xs tracking-widest text-gray-500">
              APPLY VIA GOOGLE FORM
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-snug">
              지원은 구글 폼으로 받습니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              아래 버튼을 누르면 지원서 폼이 새 탭에서 열립니다. 제출하신
              내용은 운영진이 확인한 뒤 개별 연락드립니다.
            </p>
          </div>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-10 block bg-ink py-4 text-center text-sm font-bold text-paper transition-colors duration-100 hover:bg-gray-700"
          >
            구글 폼으로 지원하기 ↗
          </a>
        </section>
      </div>
    </div>
  )
}
