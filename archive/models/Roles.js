const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true, unique: true },
    accessTo: [{
        process: { type: Schema.Types.ObjectId, ref: 'Processes' },
        operations: {
            create: { type: Boolean, default: false },
            read: { type: Boolean, default: true },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
        }
    }],
    actual: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: 'roles' })

module.exports = model('Roles', schema)
