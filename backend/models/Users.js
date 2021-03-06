const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSсhema = new Schema({
    login: {
        type: String,
        required: true,
        minlength: 4,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'manager',
        enum: [
            'manager',
            'admin', 
            'director'
        ]
    },
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    patronym: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    userImg: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phones: {
        type: [String],
        required: true
    },
    contacts: [
        {
            contactId: {
                ref: 'contacts',
                type: Schema.Types.ObjectId
            },
            value: {
                type: String,
                default: ''
            }
        }
    ],
    resetToken: String,
    resetTokenExp: String
}, {timestamps: true});

module.exports = mongoose.model('users', usersSсhema);
