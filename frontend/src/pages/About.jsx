const activities = [
  {
    title: '스터디',
    body: '학기마다 언어·CS·웹 개발 스터디를 개설합니다. 신입생은 기초부터, 고학년은 심화 주제까지 단계별로 참여합니다.',
  },
  {
    title: '프로젝트',
    body: '팀을 꾸려 한 학기 동안 서비스를 기획하고 개발합니다. 이 홈페이지도 동아리원이 직접 만들고 유지보수합니다.',
  },
  {
    title: '대회 출전',
    body: '교내외 해커톤과 프로그래밍 경진대회에 함께 출전합니다. 수상 내역 페이지에서 기록을 확인할 수 있습니다.',
  },
]

export default function About() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="font-mono text-sm text-gray-500">ABOUT</p>
      <h1 className="mt-4 text-4xl font-bold">동아리 소개</h1>

      <section className="mt-16 grid gap-12 md:grid-cols-[1fr_2fr]">
        <h2 className="text-2xl font-bold">1988년부터,<br />다시 돌아오는 곳</h2>
        <div className="max-w-[720px] space-y-4 text-gray-700">
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
      </section>

      <section className="mt-24">
        <h2 className="text-2xl font-bold">활동</h2>
        <div className="mt-8 grid gap-px bg-gray-300 md:grid-cols-3">
          {activities.map((activity) => (
            <div key={activity.title} className="bg-paper p-8">
              <h3 className="font-bold">{activity.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {activity.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
