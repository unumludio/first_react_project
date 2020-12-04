const { Router } = require('express')
const router = Router()

const Roles = require('../models/Roles')
const checkAuth = require('../middleware/checkAuth')

// /api/roles
router.post('/create', checkAuth, async (req, res) => {
    try {
        const { name, accessTo } = req.body

        if (accessTo.length === 0) {
            return res.status(400).json({ message: 'У роли должен быть хотя бы один процесс' })
        }

        const candidate = await Roles.findOne({ name }).lean()

        if (candidate) {
            return res.status(400).json({ message: 'Роль с таким названием уже существует' })
        }

        const role = await Roles.create({ name, accessTo })

        res.status(201).json({ message: `Роль ${name} создана` })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post('/addProcess', async (req, res) => {
    try {
        const { name, processId, c, r, u, d } = req.body

        const candidate = await Roles.findOne({
            $and: [{ name }, { accessTo: { $elemMatch: { process: processId } } }]
        })

        if (candidate) {
            return res.status(400).json({ message: `Такой процесс в роли ${name} уже существует` })
        }

        const process = await Roles.findOneAndUpdate({ name }, {
            $push: {
                accessTo: {
                    process: processId,
                    operations: { create: !!c, read: !!r, update: !!u, delete: !!d }
                }
            }
        })

        res.status(200).json({ message: `Роль ${name} обновлена` })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get('/getAllRoles', checkAuth, async (req, res) => {
    try {

        const roles = await Roles.find({}).lean()

        res.status(200).json(roles)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router
