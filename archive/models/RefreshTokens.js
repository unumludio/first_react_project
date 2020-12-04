const { Schema, model, Types } = require('mongoose')

const schema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    exp: { type: Number, required: true },
    refreshToken: { type: String, index: true, required: true }
})

module.exports = model('RefreshTokens', schema)
