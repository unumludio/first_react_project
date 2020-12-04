import { useState, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'

const archiveStorage = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)

  const login = useCallback((jwtToken, jwtRefreshToken, id) => {
    setToken(jwtToken)
    setRefreshToken(jwtRefreshToken)
    setUserId(id)

    localStorage.setItem(archiveStorage, JSON.stringify({
      userId: id, token: jwtToken, refreshToken: jwtRefreshToken
    }))
  }, [])

  const { request } = useHttp()
  const logout = useCallback(async () => {
    try {
      await request('/api/auth/logout', 'POST', { refreshToken })
      setToken(null)
      setRefreshToken(null)
      setUserId(null)
      localStorage.removeItem(archiveStorage)
    } catch (e) {

    }


  }, [request, refreshToken])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(archiveStorage))

    if (data && data.token && data.refreshToken) {
      login(data.token, data.refreshToken, data.userId)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, refreshToken, userId, ready }
}
