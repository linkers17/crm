const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foldersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    createdById: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdByLogin: String,
    updatedById: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        default: null
    },
    updatedByLogin: {
        type: String,
        default: ''
    },
    parentId: {
        type: String,
        default: ''
    }

}, {timestamps: true});

module.exports = mongoose.model('folders', foldersSchema);