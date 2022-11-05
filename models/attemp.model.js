const mongoose = require('mongoose')

const attemptSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    quizID: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    submission: {
        type:[{
            qType: String,
            question: String,
            choices: [String],
            response: String,
            isCorrect: Boolean,
            _id: false
        }],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxPoints: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    attemptedDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const attemptModel = new mongoose.model('attempt', attemptSchema)
module.exports = attemptModel