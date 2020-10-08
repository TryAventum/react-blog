import React, { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function ProviderLogin({ onLogin }) {
  let { token, provider } = useParams()
  let history = useHistory()

  //Fetch public options
  const loginWithProvider = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3030/users/login/${provider}/provider`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      }
    )

    localStorage.setItem(
      'x-access-token',
      response.headers.get('x-access-token')
    )

    let userData = await response.json()
    localStorage.setItem('user-data', JSON.stringify(userData))
    onLogin(userData)
    history.push('/')
  }, [])

  useEffect(() => {
    loginWithProvider()
  }, [loginWithProvider])

  return <div>Logging in...</div>
}
