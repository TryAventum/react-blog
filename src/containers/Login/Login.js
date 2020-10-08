import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { boolean } from 'boolean'

export default function Login({ onLogin, options }) {
  let history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  let facebookLogin = options && options.length && boolean(options.find(e => e.name === 'ENABLE_FACEBOOK_LOGIN').value) ? true : false
  let googleLogin = options && options.length && boolean(options.find(e => e.name === 'ENABLE_GOOGLE_LOGIN').value) ? true : false

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3030/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    localStorage.setItem(
      'x-access-token',
      response.headers.get('x-access-token')
    )

    let userData = await response.json()
    localStorage.setItem('user-data', JSON.stringify(userData))
    onLogin(userData)
    history.push('/')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="field-wrapper">
          <label htmlFor="email">Enter your email: </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
            required
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="password">Enter your password: </label>
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
          <input type="submit" value="Login!" />
          {facebookLogin&&<a href={'http://localhost:3030/users/auth/facebook'}>
            Login with Facebook
          </a>}
          {googleLogin&&<a href={'http://localhost:3030/users/auth/google'}>
            Login with Google
          </a>}
        </div>
      </form>
    </div>
  )
}
