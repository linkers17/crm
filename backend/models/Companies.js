const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companiesSchema = new Schema({
    title: {
        type: String,
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
        type: [String],
        required: true,
        unique: true
    },
    site: String,
    description: String,
    assignedUserId: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    employees: [
        {
            customerId: {
                ref: 'customers',
                type: Schema.Types.ObjectId
            },
            position: String
        }
    ],
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
    }
}, {timestamps: true});

module.exports = mongoose.model('customers', companiesSchema);