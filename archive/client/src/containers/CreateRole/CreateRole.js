import React, { useState, useEffect } from 'react'
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormGroup,
    InputLabel,

    IconButton
} from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'

import PopUp from '../../components/PopUp/PopUp'

import { useHttp } from '../../hooks/http.hook'
import classes from './CreateRole.module.css'


export default function CreateRole() {
    const { loading, request, error, clearError } = useHttp()

    const [form, setForm] = useState({
        name: 'roleName',
        accessTo: [],
    })
    const [processes, setProcesses] = useState([])
    const [message, setMessage] = useState('')
    const [processesSelect, setProcessesSelect] = useState([{
        processId: '',
        operations: {
            read: true,
            create: false,
            update: false,
            delete: false,
        },
    },])
    const [selectedProcesses, setSelectedProcesses] = useState([])


    const handleSelectChange = (event) => {
        const cloneProcesses = [...processes]
        const cloneProcessesSelect = [...processesSelect]
        const cloneSelectedProcesses = [...selectedProcesses]
        const selected = processes.find((process) => process.id === event.target.value)
        cloneProcessesSelect[event.target.name].processId = event.target.value
        cloneSelectedProcesses[event.target.name] = selected
        const cloneFilter = cloneProcesses.filter((process) => process.id !== selected.id)
        const prevSelected = selectedProcesses[event.target.name]
        if (prevSelected) {
            cloneFilter.push(prevSelected)
        }
        setProcesses([...cloneFilter])
        setProcessesSelect([...cloneProcessesSelect])
        setSelectedProcesses([...cloneSelectedProcesses])
        setForm({
            ...form,
            accessTo: [...cloneProcessesSelect]
        })
    }

    const handleCheckboxChange = (event) => {
        const cloneProcesses = [...processesSelect]

        cloneProcesses[event.target.name].operations[event.target.value] = !cloneProcesses[event.target.name].operations[event.target.value]
        setProcessesSelect([...cloneProcesses])
        setForm({
            ...form,
            accessTo: [...cloneProcesses]
        })

    }

    useEffect(() => {
        setMessage(error)
    }, [error])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await request('/api/processes/getAllProcesses')
                const processes = response.map((process) =>
                    ({ id: process._id, name: process.name })
                )
                setProcesses([...processes])
            } catch (e) {

            }
        }
        fetchData()
    }, [request])

    const updateMessageState = () => {
        setMessage('')
        clearError()
    }

    const createHandler = (async (event) => {
        event.preventDefault()
        let emptyProcesses = processesSelect.filter((process) => !!process.processId === false)
        if (!emptyProcesses.length) {
            try {
                await request('/api/roles/create', 'POST', { ...form })
                setForm({
                    name: '',
                    accessTo: [],
                    actual: false,
                })
                setProcessesSelect([{
                    processId: '',
                    operations: {
                        read: true,
                        create: false,
                        update: false,
                        delete: false,
                    }
                }])
                setMessage('Роль создана!')
            } catch (e) {
            }
        } else {
            setMessage('Выберите названия всех добавленных процессов!')
        }

    })

    const changeHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }


    const newProcessHandler = (event) => {
        let emptyProcesses = processesSelect.filter((process) => !!process.processId === false)
        if (!emptyProcesses.length) {
            processInputs()
            setProcessesSelect([...processesSelect, {
                processId: '',
                operations: {
                    read: true,
                    create: false,
                    update: false,
                    delete: false,
                }
            }])


        }

    }

    const deleteProcessHandler = (event) => {
        if (processesSelect.length > 1) {
            const index = event.target.closest('button').name
            const cloneProcesses = [...processes]
            const cloneProcessesSelect = [...processesSelect]
            const cloneSelectedProcesses = [...selectedProcesses]
            cloneProcessesSelect.splice(index, 1)
            setProcessesSelect([...cloneProcessesSelect])
            const deleted = cloneSelectedProcesses.splice(index, 1)
            if (deleted.length) {
                setSelectedProcesses([...cloneSelectedProcesses])
                cloneProcesses.push(deleted[0])
                setProcesses([...cloneProcesses])
            }
            setForm({
                ...form,
                accessTo: [...cloneProcessesSelect]
            })
        } else {
            alert('У роли должен быть хотя бы один процесс')
        }
    }


    const processInputs = () => {

        return processesSelect.map((processSelect, index) =>
            <FormControl key={Math.random()} className={classes.ProcessInput}>

                <InputLabel id="process-label">Процесс</InputLabel>
                <Select
                    labelId="process-label"
                    value={processSelect.processId}
                    onChange={handleSelectChange}
                    name={index.toString()}
                >
                    {processes.map((process, index) => (
                        <MenuItem key={process.id} value={process.id} >
                            {process.name}
                        </MenuItem>
                    ))
                    }
                    {selectedProcesses[index] && <MenuItem key={selectedProcesses[index].id} value={selectedProcesses[index].id} >
                        {selectedProcesses[index].name}
                    </MenuItem>}
                </Select>
                <FormGroup aria-label="position" row >
                    <FormControlLabel
                        checked={processSelect.operations.create}
                        control={<Checkbox color="primary" />}
                        label="Create"
                        labelPlacement="start"
                        value='create'
                        name={index.toString()}
                        onChange={(event) => handleCheckboxChange(event)}
                    />
                    <FormControlLabel
                        checked={processSelect.operations.update}
                        control={<Checkbox color="primary" />}
                        label="Update"
                        labelPlacement="start"
                        value='update'
                        name={index.toString()}
                        onChange={(event) => handleCheckboxChange(event)}
                    />
                    <FormControlLabel
                        checked={processSelect.operations.delete}
                        control={<Checkbox color="primary" />}
                        label="Delete"
                        labelPlacement="start"
                        value='delete'
                        name={index.toString()}
                        onChange={(event) => handleCheckboxChange(event)}
                    />
                </FormGroup>
                <IconButton aria-label="delete" onClick={event => deleteProcessHandler(event)} name={index.toString()} color='secondary'>
                    <DeleteIcon />
                </IconButton>
            </FormControl >)
    }

    return (
        <div>
            <h1 className={classes.Title}>Создание роли</h1>
            <form onSubmit={(event) => { createHandler(event) }} className={classes.Form}>
                <TextField
                    id="name"
                    label="Имя роли"
                    name="name"
                    value={form.name}
                    onChange={(event) => changeHandler(event)}
                />
                {processInputs()}
                <IconButton className={classes.AddProcessBtn} onClick={event => newProcessHandler(event)}>
                    <AddCircleOutlineIcon />
                </IconButton>
                <Button
                    color='primary'
                    variant='contained'
                    type="submit"
                    disabled={loading}
                    className={classes.CreateBtn}
                >
                    Создать
                </Button>

            </form>
            <PopUp
                message={message}
                clearMessage={updateMessageState}
            />
        </div>
    )
}
