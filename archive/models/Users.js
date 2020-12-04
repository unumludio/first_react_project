const { Schema, model } = require('mongoose')

const schema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Roles', require: true }],
    createdAt: { type: Date, default: Date.now },
}, { collection: 'users' })

module.exports = model('Users', schema)
