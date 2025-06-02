import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import './App.css'

const App = () => {
  const isAuthenticated = Cookies.get('jwt_token')

  return (
    <Switch>
      <Route exact path="/login" render={() => (isAuthenticated ? <Redirect to="/" /> : <Login />)} />
      <Route exact path="/" render={() => (isAuthenticated ? <Home /> : <Redirect to="/login" />)} />
      <Route exact path="/jobs" render={() => (isAuthenticated ? <Jobs /> : <Redirect to="/login" />)} />
      <Route exact path="/jobs/:id" render={() => (isAuthenticated ? <JobItemDetails /> : <Redirect to="/login" />)} />
      <Route path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  )
}

export default App
