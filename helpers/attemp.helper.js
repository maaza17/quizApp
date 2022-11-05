const isEmpty = require('is-empty')

function gradeSubmission(data, callback){
    // console.log(data)

    let submission = data.submission
    let questionSet = data.quiz.questionSet
    let answerSet = data.quiz.answerSet

    if(questionSet.length !== submission.length){
        return callback({IncompleteSolutionError: 'Please answer all questions.'}, null)
    } else {
        let graded = []
        let score = 0
        
        questionSet.forEach((item, index) => {
            let temp = {}
            temp.qType = item.qType
            temp.question = item.question
            temp.choices = item.choices
            temp.response = String(submission[index].answer)
            temp.isCorrect = false

            if(temp.response.toLowerCase() == String(answerSet[index].answer).toLowerCase()){
                temp.isCorrect = true,
                score = score + 1
            }
            graded.push(temp)
        })

        let gradedAttempt = {
            submission: graded,
            score: score
        }

        return callback(null, gradedAttempt)
    }
}

module.exports = {
    gradeSubmission: gradeSubmission
}