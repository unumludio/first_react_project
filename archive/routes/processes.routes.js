const { Router } = require('express')
const router = Router()

const Processes = require('../models/Processes')
const checkAuth = require('../middleware/checkAuth')

// /api/processes
router.post('/create', checkAuth, async (req, res) => {
    try {
        const { name, description } = req.body

        const candidate = await Processes.findOne({ name }).lean()

        if (candidate) {
            return res.status(400).json({ message: 'Процесс с таким названием уже существует' })
        }

        const newProcess = await Processes.create({ name, description })

        res.status(201).json({ message: `Процесс ${name} создан` })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/actualUpdate', checkAuth, async (req, res) => {
    try {
        const { name } = req.body

        const candidate = await Processes.findOne({ name })

        if (!candidate) {
            return res.status(400).json({ message: 'Процесс с таким названием не найден' })
        }

        const actualUpdate = await Processes.findOneAndUpdate({ name }, { actual: !candidate.actual })

        res.status(201).json({ message: `Актуальность процесса ${name} изменена` })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/descUpdate', checkAuth, async (req, res) => {
    try {
        const { name, description } = req.body

        const candidate = await Processes.findOneAndUpdate({ $and: [{ name }, { actual: { $eq: true } }] }, { description })

        if (!candidate) {
            return res.status(400).json({ message: 'Актуальный процесс с таким названием не найден' })
        }

        res.status(201).json({ message: `Описание процесса ${name} обновлено` })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/delete', checkAuth, async (req, res) => {
    try {
        const { name } = req.body

        const candidate = await Processes.findOneAndDelete({ name })

        if (!candidate) {
            return res.status(400).json({ message: 'Процесс с таким названием не найден' })
        }

        res.status(201).json({ message: `Процесс ${name} удален` })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get('/getAllProcesses', checkAuth, async (req, res) => {
    try {
        const processes = await Processes.find({}).lean()

        res.status(200).json(processes)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router
