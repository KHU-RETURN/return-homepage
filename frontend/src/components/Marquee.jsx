// 'RETURN · SINCE 1988 · KHU CSE ·' 텍스트가 흐르는 장식 띠.
// 같은 콘텐츠를 2벌 이어붙여 절반(-50%)만 이동시키면 끊김 없이 반복된다.
const TEXT = 'RETURN · SINCE 1988 · KHU CSE · '.repeat(6)

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-gray-300 bg-paper py-3"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap font-display text-sm font-bold tracking-widest text-ink">
        <span>{TEXT}</span>
        <span>{TEXT}</span>
      </div>
    </div>
  )
}
