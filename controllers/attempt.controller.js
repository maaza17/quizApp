const attempModel = require('../models/attemp.model')
const quizModel = require('../models/quiz.model')
const miscHelper = require('../helpers/misc.helper')
const attemptHelper = require('../helpers/attemp.helper')
const isEmpty = require('is-empty')
const attemptModel = require('../models/attemp.model')

function submitQuiz(req, res){
    miscHelper.verifyToken(req.body.token, (err, decoded) => {
        if(err) return res.status(400).json(err)
        else {
            if(isEmpty(req.body.quizID)) return res.status(400).json({InvalidQuizError: 'Unique quiz id not found.'})
            if(isEmpty(req.body.submission)) return res.status(400).json({SubmissionError: 'Submission is either formatted incorrectly or missing.'})
            quizModel.findOne({_id: req.body.quizID})
            .then(quiz => {
                if(!quiz) return res.status(400).json({InvalidQuizError: "Quiz not found."})
                // helper function call here
                let data = {quiz: quiz, submission: req.body.submission}
                attemptHelper.gradeSubmission(data, (gradingErr, graded) => {
                    if(gradingErr) return res.status(500).json(gradingErr)
                    else {
                        graded.quizID = req.body.quizID
                        graded.userID = decoded._id

                        let newSubmission = new attemptModel(graded)
                        newSubmission.save()
                        .then(saveDoc => {
                            return res.status(201).json(saveDoc)
                        })
                    }
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
            })
        }
    })
}

module.exports = {
    submitQuiz: submitQuiz
}