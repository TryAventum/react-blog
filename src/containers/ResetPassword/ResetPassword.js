import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function ResetPassword() {
  let { token } = useParams()
  let history = useHistory()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3030/users/resetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify({
        password,
        passwordConfirmation,
      }),
    })

    if(response.status === 200){
        history.push('/login')
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="field-wrapper">
          <label htmlFor="password">Enter your new password: </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
            required
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="passwordConfirmation">
            Repeat your new password:{' '}
          </label>
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            required
          />
        </div>
        <div className="field-wrapper">
          <input type="submit" value="Submit!" />
        </div>
      </form>
    </div>
  )
}
