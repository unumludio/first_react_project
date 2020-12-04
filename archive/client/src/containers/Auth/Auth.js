import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'

import { TextField, Button, Snackbar } from '@material-ui/core';
import classes from './Auth.module.css'


export default function Auth() {

    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()

    const [form, setForm] = useState({
        login: '',
        password: ''
    })
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (error) setIsError(true)
    }, [error])

    const loginHandler = async (event) => {
        event.preventDefault()
        try {
            const data = await request('/api/auth/login', 'POST', { ...form })
            auth.login(data.token, data.refreshToken, data.userId)
        } catch (e) {
        }
    }


    const changeHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    return (
        <div>
            <h1 className={classes.Title}>Авторизация</h1>
            <form onSubmit={event => loginHandler(event)} className={classes.Form}>
                <TextField
                    id="standard"
                    label="Логин"
                    name="login"
                    value={form.login}
                    onChange={(event) => changeHandler(event)}
                />

                <TextField
                    id="standard-password-input"
                    label="Пароль"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(event) => changeHandler(event)}
                />

                <Button
                    color='primary'
                    variant='contained'
                    type="submit"
                    disabled={loading}
                >
                    Войти
                </Button>
            </form>
            <Snackbar
                message={error}
                onClose={() => {
                    clearError()
                    setIsError(false)
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={2500}
                open={isError}
            />
        </div>
    )
}
