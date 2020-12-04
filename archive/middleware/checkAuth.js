const jwt = require('jsonwebtoken')
const config = require('config')

const RefreshTokens = require('../models/RefreshTokens')
const Users = require('../models/Users')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    const token = req.headers.authorization.split(' ')[1]
    const refreshToken = req.headers.refreshtoken

    try {

        if (!token && !refreshToken) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        jwt.verify(token, config.get('jwtSecret'))

        next()

    } catch (e) {

        try {
            const decoded = jwt.verify(refreshToken, config.get('jwtRefSecret'))

            const delRefToken = await RefreshTokens.findOneAndDelete({ refreshToken, userId: decoded.userId }).lean()

            const user = await Users.findById(decoded.userId)

            const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30)

            const newToken = jwt.sign(
                {
                    userId: decoded.userId,
                    roles: user.roles,
                },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            const newRefreshToken = jwt.sign(
                {
                    exp,
                    userId: decoded.userId
                },
                config.get('jwtRefSecret')
            )

            const newRefToken = await RefreshTokens.create({ userId: delRefToken.userId, exp, refreshToken: newRefreshToken })

            res.set({
                updTokens: true,
                userId: delRefToken.userId,
                token: newToken,
                refreshTOken: newRefreshToken,
            })
            next()

        } catch (e) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }
    }
}
