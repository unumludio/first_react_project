import React, { useEffect, useState, useCallback } from 'react'

import { Button, Snackbar } from '@material-ui/core';
import { useHttp } from '../../hooks/http.hook'


export default function BoxProcess() {

    const { loading, request, error, clearError } = useHttp()

    const [processes, setProcesses] = useState([])
    const [isError, setIsError] = useState(false)

    const getDataHandler = useCallback(async () => {
        try {
            const data = await request('/api/processes/getAllProcesses')
            setProcesses(data)
        } catch (e) {
        }
    }, [request])

    useEffect(() => {
        if (error) setIsError(true)
    }, [error])

    useEffect(() => {
        getDataHandler()
    }, [getDataHandler])



    return (
        <div>
            <h1>Box Process</h1>
            <Button
                color='primary'
                variant='contained'
                disabled={loading}
            >
                Клац
            </Button>
            <ul >{processes.map(function (process, index) {
                return <li key={index}>{process.name}</li>
            })}</ul>
            <Snackbar
                message={error}
                onClose={() => {
                    clearError()
                    setIsError(false)
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={2500}
                open={isError}
            />
        </div>


    )
}
