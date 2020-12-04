const { Router } = require('express')
const router = Router()

const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

const Users = require('../models/Users')
const RefreshTokens = require('../models/RefreshTokens')
const checkAuth = require('../middleware/checkAuth')


// /api/auth/register
router.post(
    '/register',
    [
        check('login', 'Введите логин').exists().notEmpty(),
        check('password', 'Минимальная длина пароля 8 символов')
            .isLength({ min: 8 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }

            const { login, password, repassword, name, roles } = req.body

            console.log(req.body)

            if (!roles.length) {
                return res.status(400).json({ message: 'Должна быть хоть одна роль' })
            }

            if (password !== repassword) {
                return res.status(400).json({ message: 'Пароли не совпадают' })
            }
            const candidate = await Users.findOne({ login }).lean()

            if (candidate) {
                return res.status(400).json({ message: 'Такой пользователь уже существует' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await Users.create({ login, password: hashedPassword, name, roles })

            res.status(201).json({ message: 'Пользователь создан' })

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('login', 'Введите корректный логин').exists().notEmpty(),
        check('password', 'Введите пароль').exists().notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: errors.array()[0].msg
                })
            }

            const { login, password } = req.body

            const user = await Users.findOne({ login })

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
            }

            const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)

            const token = jwt.sign(
                {
                    userId: user.id,
                    roles: user.roles,
                },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            const refreshToken = jwt.sign(
                {
                    exp,
                    userId: user.id
                },
                config.get('jwtRefSecret')
            )

            const refToken = await RefreshTokens.create({ userId: user._id, exp, refreshToken })

            res.json({ token, refreshToken, userId: user.id })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

router.post(
    '/logout',
    async (req, res) => {
        try {
            const { refreshToken } = req.body

            const delRefToken = await RefreshTokens.findOneAndDelete({ refreshToken })

            res.status(200).json({ message: 'Выход выполнен' })
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

router.post(
    '/refreshToken',
    async (req, res) => {
        try {
            const { refreshToken } = req.body

            const delRefToken = await RefreshTokens.findOneAndDelete({ refreshToken })

            res.status(200).json({ message: 'Выход выполнен' })
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)

// /api/auth/getUser
router.post(
    '/getUser',
    checkAuth,
    async (req, res) => {
        try {
            const { id } = req.body
            const user = await Users.findById(id).populate('roles')

            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    }
)


module.exports = router
