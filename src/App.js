import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Home from './containers/Home/Home'
import Login from './containers/Login/Login'
import Registration from './containers/Registration/Registration'
import ResetPassword from './containers/ResetPassword/ResetPassword'
import ProviderLogin from './containers/ProviderLogin/ProviderLogin'
import ForgetPassword from './containers/ForgetPassword/ForgetPassword'
import EmailConfirmation from './containers/EmailConfirmation/EmailConfirmation'
import Profile from './containers/Profile/Profile'
import Post from './containers/Post/Post'
import classes from './App.module.css'
import useAuth from './reactHooks/useAuth'
import useOptions from './reactHooks/useOptions'

export default function App() {
  let { user, logout, onLogin } = useAuth()
  const options = useOptions()

  let links = [
    {
      path: '/',
      label: 'Home',
    },
  ]

  const logoutLinks = [
    {
      path: '/login',
      label: 'Login',
    },
    {
      path: '/registration',
      label: 'Registration',
    },
    {
      path: '/forgot-password',
      label: 'Forget Password',
    },
  ]

  const loginLinks = [
    {
      path: '/profile',
      label: 'Profile',
    },
    {
      path: '/logout',
      label: 'Logout',
      onClick: (e) => {
        e.preventDefault()
        logout()
      },
    },
  ]

  if(user){
    links = [...links, ...loginLinks]
  }else{
    links = [...links, ...logoutLinks]
  }

  return (
    <Router>
      <div>
        <nav className={classes.mainNav}>
          <ul>
            {links.map((l) => (
              <li key={l.label} onClick={l.onClick}>
                <Link to={l.path}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <h1>The Awesome Blog</h1>

        <Switch>
          <Route path="/registration">
            <Registration user={user} onLogin={onLogin} />
          </Route>
          <Route path="/reset-password/:token">
            <ResetPassword />
          </Route>
          <Route path="/email-confirmation/:token">
            <EmailConfirmation onLogin={onLogin} />
          </Route>
          <Route path="/forgot-password">
            <ForgetPassword />
          </Route>
          <Route path="/profile">
            <Profile user={user} onLogin={onLogin} />
          </Route>
          <Route path="/login/:provider/:token">
            <ProviderLogin onLogin={onLogin} />
          </Route>
          <Route path="/login">
            <Login onLogin={onLogin} options={options} />
          </Route>
          <Route path="/post/:id">
            <Post user={user} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
