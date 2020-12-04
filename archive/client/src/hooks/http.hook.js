import { useState, useCallback, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { logout } = useContext(AuthContext)

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    const userData = JSON.parse(localStorage.getItem('userData'))


    setLoading(true)
    try {

      headers['Cache-Control'] = 'no-store'
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'

      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }
      if (userData) {
        headers['Authorization'] = 'Bearer ' + userData.token || null
        headers['refreshToken'] = userData.refreshToken || null
      }

      const response = await fetch(url, { method, body, headers })
      const data = await response.json()

      if (response.headers.get('updTokens')) {
        localStorage.setItem('userData', JSON.stringify({
          token: response.headers.get('token'),
          refreshToken: response.headers.get('refreshToken'),
          userId: response.headers.get('userId')
        }))
      }

      if (response.status === 401) {
        localStorage.removeItem('userData')
        setLoading(false)
        logout()
        throw new Error('Проблемы с авторизацией')

      }

      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }

      setLoading(false)

      return data
    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [logout])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { loading, request, error, clearError }
}
