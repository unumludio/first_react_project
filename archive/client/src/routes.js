import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import BoxProcess from './containers/BoxProcess/BoxProcess'
import Auth from './containers/Auth/Auth'
import Profile from './containers/Profile/Profile'
import Register from './containers/Register/Register'
import CreateRole from './containers/CreateRole/CreateRole'


import NotFound from './components/NotFound/NotFound'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/profile" />
                </Route>
                <Route path="/profile" exact>
                    <Profile />
                </Route>
                <Route path="/box" exact>
                    <BoxProcess />
                </Route>
                <Route path="/createRole" exact>
                    <CreateRole />
                </Route>
                <Route path="/register" exact>
                    <Register />
                </Route>
                <Route path="*" >
                    <NotFound />
                </Route>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <Auth />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
