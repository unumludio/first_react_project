import React, { useState, useEffect } from 'react'
import PopUp from '../../components/PopUp/PopUp'

import { useHttp } from '../../hooks/http.hook'
import classes from './Profile.module.css'

export default function Profile() {

    const [message, setMessage] = useState('')
    const [user, setUser] = useState('')

    const { loading, request, error, clearError } = useHttp()

    useEffect(() => {
        setMessage(error)
    }, [error])

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'))
                const response = await request('/api/auth/getUser', 'POST', {
                    id: userData.userId
                })
                setUser(response)
            } catch (e) {

            }
        }
        fetchData()
    }, [request])

    const updateMessageState = () => {
        setMessage('')
        clearError()
    }

    return (
        <div>
            <h1>Profile page</h1>
            <div>{user.login}</div>
            <PopUp
                message={message}
                clearMessage={updateMessageState}
            />
        </div>

    )
}
