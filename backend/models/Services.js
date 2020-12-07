const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdById: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdByLogin: String,
    description: String
});

module.exports = mongoose.model('services', servicesSchema);
