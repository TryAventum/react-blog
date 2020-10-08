import React, { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function EmailConfirmation({ onLogin }) {
  let { token } = useParams()
  let history = useHistory()

  const confirmEmail = useCallback(async () => {
    const response = await fetch(
      `http://localhost:3030/users/emailConfirmation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      }
    )

    if (response.status === 200) {
        let userData = JSON.parse(localStorage.getItem('user-data'))
        userData.emailConfirmation = true
        localStorage.setItem('user-data', JSON.stringify(userData))
        onLogin(userData)
        history.push('/profile')
    }

  }, [])

  useEffect(() => {
    confirmEmail()
  }, [confirmEmail])

  return <div>Verifying...</div>
}
