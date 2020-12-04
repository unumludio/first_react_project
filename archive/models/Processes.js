const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, require: true },
    actual: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'processes' })

module.exports = model('Processes', schema)
