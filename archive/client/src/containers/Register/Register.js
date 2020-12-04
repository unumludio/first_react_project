import React, { useState, useEffect } from 'react'
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Input } from '@material-ui/core'
import PopUp from '../../components/PopUp/PopUp'

import { useHttp } from '../../hooks/http.hook'
import classes from './Register.module.css'

export default function Register() {
    const { loading, request, error, clearError } = useHttp()

    const [form, setForm] = useState({
        login: 'Pasha',
        password: '12345678',
        repassword: '12345678',
        name: 'Паша',
        roles: []
    })
    const [roles, setRoles] = useState([])
    const [message, setMessage] = useState('')


    useEffect(() => {
        setMessage(error)
    }, [error])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await request('/api/roles/getAllRoles')
                const roles = response.map((role) => (
                    { id: role._id, name: role.name }
                ))
                setRoles([...roles])
            } catch (e) {

            }
        }
        fetchData()
    }, [request])

    const updateMessageState = () => {
        setMessage('')
        clearError()
    }

    const registerHandler = (async (event) => {
        event.preventDefault()
        try {
            await request('/api/auth/register', 'POST', { ...form })
            setForm({
                login: '',
                password: '',
                repassword: '',
                name: '',
                roles
            })
            setMessage('Пользователь создан!')
        } catch (e) {
        }
    })

    const changeHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    return (
        <div>
            <h1 className={classes.Title}>Регистрация</h1>
            <form onSubmit={(event) => { registerHandler(event) }} className={classes.Form}>
                <TextField
                    id="login"
                    label="Логин"
                    name="login"
                    value={form.login}
                    onChange={(event) => changeHandler(event)}
                />

                <TextField
                    id="password"
                    label="Пароль"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(event) => changeHandler(event)}
                />

                <TextField
                    id="repassword"
                    label="Повторите пароль"
                    type="password"
                    name="repassword"
                    value={form.repassword}
                    onChange={(event) => changeHandler(event)}
                />
                <TextField
                    id="name"
                    label="Имя"
                    name="name"
                    value={form.name}
                    onChange={(event) => changeHandler(event)}
                />
                <FormControl>
                    <InputLabel id="select-label">Роли</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        multiple
                        value={form.roles}
                        onChange={(event) => changeHandler(event)}
                        name="roles"
                        input={<Input />}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    color='primary'
                    variant='contained'
                    type="submit"
                    disabled={loading}
                >
                    Регистрация
                </Button>

            </form>
            <PopUp
                message={message}
                clearMessage={updateMessageState}
            />
        </div>
    )
}
