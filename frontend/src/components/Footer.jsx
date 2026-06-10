export default function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1120px] px-6 pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-gray-700 pb-10">
          <p className="text-sm text-gray-300">
            경희대학교 컴퓨터공학부 학술동아리
          </p>
          <p className="font-mono text-xs tracking-widest text-gray-500">
            github.com/KHU-RETURN · @khu_return · SINCE 1988
          </p>
        </div>
      </div>
      {/* 거대 아웃라인 워드마크: 푸터를 닫는 그래픽 */}
      <p
        aria-hidden="true"
        className="text-outline mx-auto max-w-[1120px] select-none px-6 pb-6 pt-10 font-display text-[clamp(4rem,12.5vw,10rem)] font-bold leading-none tracking-tight text-paper"
      >
        RETURN
      </p>
    </footer>
  )
}
