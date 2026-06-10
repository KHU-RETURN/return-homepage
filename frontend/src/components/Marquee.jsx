// 'RETURN · SINCE 1988 · KHU CSE' 텍스트가 흐르는 장식 띠.
// 솔리드와 아웃라인 글자를 교차시켜 흑백만으로 리듬을 만든다.
// 같은 콘텐츠를 2벌 이어붙여 절반(-50%)만 이동시키면 끊김 없이 반복된다.
const TOKENS = ['RETURN', 'SINCE 1988', 'KHU CSE']

function Strip() {
  // 6회 반복 × 3토큰 = 18개. 홀수 번째는 아웃라인 처리
  const items = Array.from({ length: 18 }, (_, i) => ({
    text: TOKENS[i % 3],
    outline: i % 2 === 1,
  }))
  return (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={item.outline ? 'text-outline' : ''}>
            {item.text}
          </span>
          <span className="mx-5" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </span>
  )
}

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-b border-gray-300 bg-paper py-4"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap font-display text-2xl font-bold tracking-wide text-ink">
        <Strip />
        <Strip />
      </div>
    </div>
  )
}
