import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'

import { useRoutes } from './routes'

import { PrimarySearchAppBar as Menu } from './components/Menu/Menu'

function App() {

  const { token, login, logout, userId, ready } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <CircularProgress style={{ margin: "0 auto", display: "block" }} />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <Router>
        {isAuthenticated && <Menu />}
        <div className="App">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App
