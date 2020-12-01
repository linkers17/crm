const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String
    }
});

module.exports = mongoose.model('contacts', contactsSchema);
