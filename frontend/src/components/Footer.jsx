export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-baseline justify-between gap-4 px-6 py-12">
        <p className="text-sm text-gray-300">
          경희대학교 컴퓨터공학부 학술동아리
        </p>
        <p className="font-mono text-xs tracking-widest text-gray-500">
          <a
            href="https://github.com/KHU-RETURN"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition-colors duration-100 hover:text-paper"
          >
            github.com/KHU-RETURN
          </a>
          {' · '}
          <a
            href="https://www.instagram.com/khu_return/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 transition-colors duration-100 hover:text-paper"
          >
            @khu_return
          </a>
          {' · SINCE 1988'}
        </p>
      </div>
    </footer>
  )
}
