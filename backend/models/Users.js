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
        ref: 'roles',
        type: Schema.Types.ObjectId,
        default: ''
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
    bithday: {
        type: Date,
        required: true
    },
    userImg: {
        type: String,
        required: true,
        default: 'no-photo'
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phones: [
        {
            phone: {
                type: String,
                required: true
            }
        }
    ],
    contacts: [
        {
            value: {
                type: String
            },
            name: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model('users', usersSсhema);
