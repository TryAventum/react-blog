import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import EmailConfirmationStatus from '../../components/EmailConfirmationStatus/EmailConfirmationStatus'

export default function Profile({ user, onLogin }) {
  let history = useHistory()

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [email, setEmail] = useState(user.email)
  const [picture, setPicture] = useState(user.picture)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3030/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token'),
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        picture,
        password,
        passwordConfirmation,
      }),
    })

    let userData = await response.json()
    localStorage.setItem('user-data', JSON.stringify(userData.user))
    onLogin(userData.user)
    history.push('/')
  }

  return (
    <div>
      <EmailConfirmationStatus user={user} />
      <form onSubmit={onSubmit}>
        <div className="field-wrapper">
          <label htmlFor="firstName">First Name: </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            name="firstName"
            id="firstName"
            required
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="lastName">Last Name: </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            name="lastName"
            id="lastName"
            required
          />
        </div>
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
          <label htmlFor="picture">Profile picture link: </label>
          <input
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            type="text"
            name="picture"
            id="picture"
            required
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="password">Enter new password: </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            id="password"
          />
        </div>
        <div className="field-wrapper">
          <label htmlFor="passwordConfirmation">
            Repeat your new password:{' '}
          </label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" value="Update Profile!" />
        </div>
      </form>
    </div>
  )
}
