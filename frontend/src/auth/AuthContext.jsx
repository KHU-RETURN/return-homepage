// 로그인 상태를 앱 전체에서 공유하는 컨텍스트.
// 페이지가 처음 열릴 때 GET /api/auth/me로 로그인 여부를 복원한다.
import { createContext, useContext, useEffect, useState } from 'react'
import { fetchMe, login as apiLogin, logout as apiLogout } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // 최초 복원이 끝나기 전까지 true

  async function refresh() {
    try {
      setUser(await fetchMe())
    } catch {
      setUser(null) // 401 = 비로그인 상태
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const loggedIn = await apiLogin(username, password)
    setUser(loggedIn)
    return loggedIn
  }

  async function logout() {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
