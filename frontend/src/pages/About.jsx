const activities = [
  {
    no: '01',
    title: '스터디',
    body: '학기마다 언어·CS·웹 개발 스터디를 개설합니다. 신입생은 기초부터, 고학년은 심화 주제까지 단계별로 참여합니다.',
  },
  {
    no: '02',
    title: '프로젝트',
    body: '팀을 꾸려 한 학기 동안 서비스를 기획하고 개발합니다. 이 홈페이지도 동아리원이 직접 만들고 유지보수합니다.',
  },
  {
    no: '03',
    title: '대회 출전',
    body: '교내외 해커톤과 프로그래밍 경진대회에 함께 출전합니다. 수상 내역 페이지에서 기록을 확인할 수 있습니다.',
  },
]

export default function About() {
  return (
    <div>
      <div className="mx-auto max-w-[1120px] px-6 pt-24 pb-20">
        <p className="font-mono text-sm text-gray-500">ABOUT</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
          동아리 소개
        </h1>
      </div>

      {/* 반전 섹션: 동아리의 뿌리 */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6 py-24 md:grid-cols-[1fr_2fr]">
          <div>
            <span className="text-outline font-display text-6xl font-bold text-paper">
              01
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              1988년부터,
              <br />
              다시 돌아오는 곳
            </h2>
          </div>
          <div className="max-w-[720px] space-y-4 self-end text-gray-300">
            <p>
              RETURN은 1988년 창립된 경희대학교 컴퓨터공학부 학술동아리입니다.
              졸업한 선배가 후배에게, 배운 사람이 배우는 사람에게 다시 돌아와
              지식을 나눈다는 뜻을 이름에 담았습니다.
            </p>
            <p>
              동아리원 간의 활발한 학술 교류와 프로젝트 개발을 통해
              수업만으로는 채우기 어려운 실전 경험을 쌓습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 py-24">
        <div className="flex items-baseline gap-6">
          <span className="text-outline font-display text-6xl font-bold text-ink">
            02
          </span>
          <h2 className="text-3xl font-bold">무엇을 하나요</h2>
        </div>
        <div className="mt-10 grid gap-px border border-gray-300 bg-gray-300 md:grid-cols-3">
          {activities.map((activity) => (
            <div
              key={activity.no}
              className="group bg-paper p-8 transition-colors duration-100 hover:bg-ink hover:text-paper"
            >
              <span className="font-mono text-sm text-gray-500">
                {activity.no}
              </span>
              <h3 className="mt-6 text-lg font-bold">{activity.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 transition-colors duration-100 group-hover:text-gray-300">
                {activity.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
