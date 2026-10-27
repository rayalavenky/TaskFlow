const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type :String,
            required: [true, 'Please provide a title for the task'],
            trim: true,
            maxLength: [150, 'Task title should not be more than 150 characters']
        },
        description: {
            type : String,
            trim: true,
            default: "",
            maxLength: [500, 'Task description should not be more than 500 characters']
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        dueDate: {
            type: Date,
            default: null
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);