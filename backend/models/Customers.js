const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customersSchema = new Schema({
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
    addressPostalCode: {
        type: String,
        required: true
    },
    addressCity: {
        type: String,
        required: true
    },
    addressStreet: {
        type: String,
        required: true
    },
    addressHome: {
        type: String,
        required: true
    },
    addressRoom: String,
    phones: {
        type: [String],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    site: String,
    description: String,
    doNotCall: {
        type: Boolean,
        default: false
    },
    assignedUserId: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdById: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    createdByLogin: String,
    documentIds: {
        ref: 'documents',
        type: [Schema.Types.ObjectId]
    },
    orderIds: {
        ref: 'orders',
        type: [Schema.Types.ObjectId]
    },
    taskIds: {
        ref: 'tasks',
        type: [Schema.Types.ObjectId]
    },
    noteIds: {
        ref: 'notes',
        type: [Schema.Types.ObjectId]
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
    ]
}, {timestamps: true});

module.exports = mongoose.model('customers', customersSchema);