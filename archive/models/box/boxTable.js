const { Schema, model } = require('mongoose')

const schema = new Schema({
    number: { type: number, required: true, unique: true },
    archivNumber: { type: String, required: true, unique: true },
    openDate: { type: Date, required: true },
    openEmployee: { type: Schema.Types.ObjectId, ref: 'Users' },
    closeDate: { type: Date, required: true },
    closeEmployee: { type: Schema.Types.ObjectId, ref: 'Users' },
    documentsType: { type: String },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },

}, { collection: 'boxTable' })

module.exports = model('BoxTable', schema)