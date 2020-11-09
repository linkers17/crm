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
    updatedById: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        default: null
    },
    parentId: {
        ref: 'folders',
        type: Schema.Types.ObjectId,
        default: null
    }

}, {timestamps: true});

module.exports = mongoose.model('folders', foldersSchema);