import { Link, NavLink } from 'react-router-dom'

const menus = [
  { to: '/about', label: '동아리 소개' },
  { to: '/awards', label: '수상 내역' },
  { to: '/recruit', label: '모집 · 지원' },
]

export default function Header() {
  return (
    <header className="border-b border-gray-300">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          RETURN
        </Link>
        <nav className="flex gap-8">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold underline underline-offset-8'
                  : 'text-sm text-gray-700 hover:text-ink hover:underline hover:underline-offset-8'
              }
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
