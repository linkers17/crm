const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    stage: {
        type: String,
        enum: [
            'prospecting',
            'offer',
            'negotiation',
            'closed won',
            'closed loose'
        ],
        default: 'prospecting'
    },
    servicesList: [
        {
            title: String,
            quantity: Number,
            amount: Number
        }
    ],
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
    updatedByLogin: String,
    dateEnd: {
        type: Date,
        default: null
    },
    assignedUserId: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    documentIds: {
        ref: 'documents',
        type: [Schema.Types.ObjectId]
    },
    customerId: {
        ref: 'customers',
        type: Schema.Types.ObjectId,
        default: null
    },
    companyId: {
        ref: 'companies',
        type: Schema.Types.ObjectId,
        default: null
    },
    amount: Number,
    description: String
}, {timestamps: true});

module.exports = mongoose.model('orders', ordersSchema);