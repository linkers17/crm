const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasksSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    deadline: Date,
    dateEnd: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: [
            'not_started',  // Не началась
            'started',      // Началась
            'completed',    // Завершена
            'canceled',     // Отменена
            'deffered'      // Отложена
        ],
        default: 'started'
    },
    priority: {
        type: String,
        enum: [
            'normal',   // Обычный
            'low',      // Низкий
            'high',     // Высокий
            'urgent',   // Срочно
        ],
        default: 'normal'
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
    parentId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    documentIds: {
        ref: 'documents',
        type: [Schema.Types.ObjectId]
    }

}, {timestamps: true});

module.exports = mongoose.model('tasks', tasksSchema);