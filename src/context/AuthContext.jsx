// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

async function request(path, body) {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data // expected: { token, user }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page refresh, check if a saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const save = ({ token, user }) => {
    localStorage.setItem('token', token)
    setUser(user)
  }

  const login = async (email, password) => save(await request('login', { email, password }))
  const signup = async form => save(await request('signup', form))
  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}