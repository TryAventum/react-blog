import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

export default function ForgetPassword() {
    let history = useHistory()
    const [email, setEmail] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    const response = await fetch('http://localhost:3030/users/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email
      }),
    })


    if(response.status === 200){
        history.push('/')
    }
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
          <input type="submit" value="Submit!" />
        </div>
      </form>
    </div>
  )
}
