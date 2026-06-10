export default function About() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mx-auto max-w-[1120px] px-6 pt-24 pb-20">
        <p className="font-mono text-sm text-gray-500">ABOUT</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight">
          동아리 소개
        </h1>
      </div>

      {/* 01 — 반전 섹션: 슬로건 + 정체성 */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <div className="grid gap-16 md:grid-cols-[1fr_2fr]">
            <div>
              <span className="text-outline font-display text-6xl font-bold text-paper">
                01
              </span>
              <h2 className="mt-6 text-3xl font-bold leading-tight">
                1988년부터,
                <br />
                다시 돌아오는 곳
              </h2>
              <p className="mt-4 font-mono text-xs tracking-widest text-gray-500">
                EST. 1988 · KHU CSE
              </p>
            </div>
            <div className="self-end space-y-6">
              <blockquote className="border-l-2 border-paper pl-6 font-display text-xl font-bold leading-snug text-paper md:text-2xl">
                "각자가 하고싶은 것 모두를 할 수 있도록 서포트하자."
              </blockquote>
              <div className="space-y-4 text-gray-300">
                <p>
                  RETURN은 1988년 창립된 경희대학교 소프트웨어융합대학
                  컴퓨터공학부 학술동아리입니다. 졸업한 선배가 후배에게,
                  배운 사람이 배우는 사람에게 다시 돌아와 지식을 나눈다는
                  뜻을 이름에 담았습니다.
                </p>
                <p>
                  동아리원 간의 활발한 학술 교류와 프로젝트 개발을 통해
                  수업만으로는 채우기 어려운 실전 경험을 쌓습니다. 창립
                  이후 지금까지 수십 회의 수상 기록과 NAVER·넥슨 등
                  현업에서 활동하는 졸업 선배들이 RETURN의 이름을
                  이어가고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — 지원 제도 */}
      <section className="mx-auto max-w-[1120px] px-6 py-24">
        <div className="flex items-baseline gap-6 border-b border-ink pb-4">
          <span className="text-outline font-display text-6xl font-bold text-ink">
            02
          </span>
          <h2 className="text-3xl font-bold">지원 제도</h2>
        </div>
        <div className="mt-10 grid gap-px border-x border-b border-gray-300 bg-gray-300 md:grid-cols-2">
          {[
            {
              no: '01',
              title: '세미나 연구비',
              body: '자유 주제 세미나를 개최하면 연구비를 지원합니다. 발표 주제와 방식에 제한이 없습니다.',
            },
            {
              no: '02',
              title: '스터디 활동비',
              body: '학기 중 스터디를 꾸리면 활동비를 지원합니다. 언어·CS·웹 개발 등 주제는 자유입니다.',
            },
            {
              no: '03',
              title: '개발 활동비',
              body: '프로젝트 계획서와 결과물을 제출하면 개발 활동비를 지원합니다.',
            },
            {
              no: '04',
              title: '오픈스터디 (2020~)',
              body: '비회원도 참여할 수 있는 오픈 스터디 제도. 더 많은 사람과 함께 배웁니다.',
            },
          ].map((item) => (
            <div key={item.no} className="group bg-paper p-8 transition-colors duration-100 hover:bg-ink hover:text-paper">
              <span className="font-mono text-sm text-gray-500 group-hover:text-gray-400">
                {item.no}
              </span>
              <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 transition-colors duration-100 group-hover:text-gray-300">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — 커뮤니티 */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24">
        <div className="flex items-baseline gap-6 border-b border-ink pb-4">
          <span className="text-outline font-display text-6xl font-bold text-ink">
            03
          </span>
          <h2 className="text-3xl font-bold">커뮤니티</h2>
        </div>
        <div className="mt-10 grid gap-px border-x border-b border-gray-300 bg-gray-300 md:grid-cols-3">
          {[
            {
              no: '01',
              title: '질문방',
              body: '재학생·졸업생·연구실 연구생이 함께하는 질문 채널. 공부하다 막힌 것을 바로 물어볼 수 있습니다.',
            },
            {
              no: '02',
              title: '선배들의 이야기',
              body: 'NAVER·넥슨 등 현업에서 활동하는 선배를 초청해 진로와 실무 이야기를 나눕니다.',
            },
            {
              no: '03',
              title: '멘토-멘티',
              body: '고학년·졸업생 멘토가 신입생과 짝을 이뤄 학업·취업·동아리 활동을 함께 이끕니다.',
            },
          ].map((item) => (
            <div key={item.no} className="group bg-paper p-8 transition-colors duration-100 hover:bg-ink hover:text-paper">
              <span className="font-mono text-sm text-gray-500 group-hover:text-gray-400">
                {item.no}
              </span>
              <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 transition-colors duration-100 group-hover:text-gray-300">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — 자체 행사 */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24">
        <div className="flex items-baseline gap-6 border-b border-ink pb-4">
          <span className="text-outline font-display text-6xl font-bold text-ink">
            04
          </span>
          <h2 className="text-3xl font-bold">자체 행사</h2>
        </div>
        <ul className="mt-0 divide-y divide-gray-300 border-b border-gray-300">
          {[
            { tag: 'HACKATHON', name: 'RE:THON', desc: 'RETURN 자체 해커톤. 아이디어부터 프로토타입까지 하룻밤에.' },
            { tag: 'GAME', name: 'RCK', desc: '동아리 내부 게임 대회. 개발 외의 방식으로도 함께 경쟁합니다.' },
            { tag: 'SOCIAL', name: '개강·종강총회', desc: '학기 시작과 끝을 함께 마무리하는 동아리 전체 모임.' },
            { tag: 'SOCIAL', name: 'MT · 밥조 · 모각코', desc: '동아리원끼리 더 가까워지는 소소한 자리들.' },
          ].map((event) => (
            <li key={event.name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-6">
              <span className="w-24 shrink-0 font-mono text-xs tracking-widest text-gray-500">
                {event.tag}
              </span>
              <span className="font-bold">{event.name}</span>
              <span className="text-sm text-gray-700">{event.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 05 — 연혁 하이라이트: 반전 섹션 */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1120px] px-6 py-24">
          <div className="flex items-baseline gap-6 border-b border-gray-700 pb-4">
            <span className="text-outline font-display text-6xl font-bold text-paper">
              05
            </span>
            <h2 className="text-3xl font-bold">연혁</h2>
          </div>
          <ul className="mt-0 divide-y divide-gray-700 border-b border-gray-700">
            {[
              { year: '2017', text: '동아리 회칙 제정 · 쿠톤 우수상 수상' },
              { year: '2018', text: '자체 홈페이지 구축 · C++·Python·머신러닝 교육 시작' },
              { year: '2019', text: '창립 30주년' },
              { year: '2020', text: '오픈스터디 제도 도입' },
              { year: '2022', text: '유니톤 9기 대상 · 의료 AI 해커톤 대구광역시장상 등 수상 다수' },
              { year: '2023', text: '경희고 알고리즘·안드로이드 실습 강사 활동' },
            ].map((item) => (
              <li key={item.year} className="flex items-baseline gap-8 py-5">
                <span className="w-16 shrink-0 font-mono text-sm tabular-nums text-gray-500">
                  {item.year}
                </span>
                <span className="text-sm leading-relaxed text-gray-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
