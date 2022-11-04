const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    authorID: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    quizName:{
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    quizTopic:{
        type: String,
        required: true
    },
    questionSet: {
        type: [{
            qType: {type: String, enum: ['blank', 'mcq']},
            question: String,
            choices: [String],
            _id: false
        }],
        required: true,
        default: []
    },
    answerSet: {
        type: [{
            answer: String
        }],
        required: true,
        default: []
    },
    numProblems:{
        type: Number,
        required: true
    },
    maxPoints: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

quizModel = new mongoose.model('quiz', quizSchema)
module.exports = quizModel