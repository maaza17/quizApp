const quizModel = require('../models/quiz.model')
const quizHelper = require('../helpers/quiz.helper')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const isEmpty = require('is-empty')

function createQuiz(req, res) {
    quizHelper.verifyToken(req.body.token, (err, decoded) => {
        if(err) return res.status(400).json(err)
        else {
            if(!req.body.quiz || isEmpty(req.body.quiz)) return res.status(400).json({QuizCanNotBeEmptyError: 'Quiz can not be empty.'})
            let newQuiz = req.body.quiz
            newQuiz.authorID = decoded._id
            newQuiz.authorEmail = decoded.email
            newQuiz.numProblems = newQuiz.questionSet.length
            newQuiz.maxPoints = newQuiz.answerSet.length

            newQuiz = new quizModel(newQuiz)

            newQuiz.save()
            .then(saveDoc => {
                return res.status(201).json({message: 'Quiz created successfully.'})
            })
            .catch(saveErr => {
                return res.status(500).json({UnexpectedError: 'An unexpected error occured. Please try again later.'})
            })
        }
    })
}

function listAllQuizzes(req, res){
    quizModel.find({}, {_id: true, quizName: true, quizTopic: true, authorEmail: true, thumbnail: true, numProblems: true, dateCreated: true})
    .then(docs => {
        if(docs.lenght <= 0) return res.status(404).json({NoResourceFoundError: "No quizzes are present at this time."})
        else {
            return res.status(200).json(docs)
        }
    })
}

function listQuizzesByTopic(req, res){
    if(isEmpty(req.body.topicFilter)) return res.status(400).json({MissingParameterError:"Topic filter is missing."})
    if(req.body.topicFilter[0] == ""){
        quizModel.find({}, {_id: true, quizName: true, quizTopic: true, authorEmail: true, thumbnail: true, numProblems: true, dateCreated: true}, {skip:Number(req.params.paginate)*10, limit: 10})
        .then(docs => {
            if(docs.lenght <= 0) return res.status(404).json({NoResourceFoundError: "No quizzes are present at this time."})
            else {
                return res.status(200).json(docs)
            }
        })
    } else {
        quizModel.find({quizTopic: {$in: req.body.topicFilter}}, {_id: true, quizName: true, quizTopic: true, authorEmail: true, thumbnail: true, numProblems: true, dateCreated: true}, {skip:Number(req.params.paginate)*10, limit: 10})
        .then(docs => {
            if(docs.lenght <= 0) return res.status(404).json({NoResourceFoundError: "No quizzes are present at this time."})
            else {
                return res.status(200).json(docs)
            }
        })
    }
}

module.exports = {
    createQuiz: createQuiz,
    listAllQuizzes: listAllQuizzes,
    listQuizzesByTopic: listQuizzesByTopic
}