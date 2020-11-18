const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'active',   // Действующий
            'draft',    // Черновик
            'expired',  // Просрочен
            'canceled'  // Отменен
        ],
        default: 'active'
    },
    type: {
        type: String,
        enum: [
            'agreement',    // Договор
            'contract',     // Контракт
            'pattern',      // Шаблон
            'report',        // Отчёт
            null            // Нет
        ],
        default: null
    },
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
    assignedUserId: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        default: null
    },
    folderId: {
        ref: 'folders',
        type: Schema.Types.ObjectId,
        default: null
    },
    description: String,
    filePath: String

}, {timestamps: true});

module.exports = mongoose.model('documents', documentsSchema);