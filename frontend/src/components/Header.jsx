import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const menus = [
  { to: '/about', label: '소개' },
  { to: '/activities', label: '활동' },
  { to: '/awards', label: '수상' },
  { to: '/board/notice', label: '게시판' },
  { to: '/recruit', label: '모집 · 지원' },
]

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-ink text-paper">
      <div className="mx-auto flex min-h-16 max-w-[1120px] flex-wrap items-center gap-x-8 gap-y-2 px-6 py-3">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          RETURN
          <span aria-hidden="true" className="animate-caret">
            _
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {menus.map((menu) => (
            <NavLink
              key={menu.to}
              to={menu.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-bold underline underline-offset-8'
                  : 'text-sm text-gray-300 transition-colors duration-100 hover:text-paper hover:underline hover:underline-offset-8'
              }
            >
              {menu.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto">
          {user ? (
            <Link
              to="/mypage"
              className="text-sm text-gray-300 transition-colors duration-100 hover:text-paper hover:underline hover:underline-offset-8"
            >
              <span className="font-bold text-paper">{user.name}</span> · 마이페이지
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm text-gray-300 transition-colors duration-100 hover:text-paper hover:underline hover:underline-offset-8"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
