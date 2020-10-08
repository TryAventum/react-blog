import React, { useState } from 'react'
import classes from './EmailConfirmationStatus.module.css'

export default function EmailConfirmationStatus({ user }) {
  const [sending, setSending] = useState(false)

  async function resendConfirmationEmail(event) {
    event.preventDefault()
    setSending(true)
    const response = await fetch(
      'http://localhost:3030/users/resendConfirmationEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('x-access-token'),
        },
      }
    )

    if (response.status === 200) {
      setSending(false)
    }
  }

  return (
    <div>
      {user&&<div>
        {
          user.emailConfirmation
            ? 'Email address confirmed!'
            : 'Please confirm your email address!'}
      </div>}
      {user && !user.emailConfirmation && !sending && <a className={classes.resendLink} onClick={resendConfirmationEmail}>Resend confirmation email?</a>}
      {sending && <div>Sending...</div>}
    </div>
  )
}
