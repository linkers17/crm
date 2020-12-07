const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    createdById: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdByLogin: String,
    parentId: Schema.Types.ObjectId
}, {timestamps: true});

module.exports = mongoose.model('notes', notesSchema);