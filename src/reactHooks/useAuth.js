import { useEffect, useState, useCallback } from 'react'

export default () => {
  const localUserDate = localStorage.getItem('user-data')
  const [user, setUser] = useState(localUserDate ? JSON.parse(localUserDate) : null)

  function logout() {
    localStorage.removeItem('user-data')
    localStorage.removeItem('x-access-token')
    setUser(null)
  }

  const onLogin = (_userData)=>{
    setUser(_userData)
  }

  //Fetch current user
  const getCurrentUser = useCallback(async (_p) => {
    const response = await fetch(`http://localhost:3030/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token'),
      },
    })
    let userData = await response.json()
    localStorage.setItem('user-data', JSON.stringify(userData))
    setUser(userData)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('x-access-token')) {
      getCurrentUser()
    } else {
      setUser(null)
    }
  }, [getCurrentUser])

  return { user, logout, onLogin }
}
