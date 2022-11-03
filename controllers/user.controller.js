const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

function getAll(req, res) {

    userModel.find({}, {fullname: true, email: true, dateCreated: true})
    .then(docs => {
        if(docs.length <= 0){
            return res.status(404).json({
                error: 'No users found.'
            })
        } else {
            return res.status(200).json(docs)
        }
    })
    .catch(err => {
        return res.status(400).json({error: 'Bad request'})
    })
}

module.exports = {
    getAll: getAll
}