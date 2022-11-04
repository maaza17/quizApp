const jwt = require('jsonwebtoken')
const { generateToken, hashPassword } = require('../helpers/user.helper')
const userHelper = require('../helpers/user.helper')
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')

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
        return res.status(400).json({BadRequestError: 'Bad request'})
    })
}

function login(req, res) {
    const {isValid, errors} = userHelper.validateLoginInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    } else {
        // find user from database using email to compare passwords
        userModel.findOne({email: req.body.email, status: 'verified'})
        .then(doc => {
            bcrypt.compare(req.body.password, doc.password)
            .then(isMatch => {
                if(!isMatch) return res.status(401).json({IncorrectPasswordError: 'Passwords do not match.'})
                else {
                    let payload = {
                        _id: doc._id,
                        fullname: doc.fullname,
                        email: doc.email,
                        status: doc.status
                    }
    
                    jwt.sign(payload, process.env.ENCRYPTION_SECRET, {expiresIn: 172800}, (signErr, token) => {
                        if(signErr) return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
                        else {
                            return res.status(200).json({message:'Login successfull.', token: token})
                        }
                    })
                }
            })
        })
        .catch(err => {
            return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
        })
    }


}

function register(req, res) {
    const {isValid, errors} = userHelper.validateRegisterInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors)
    } else {
        bcrypt.genSalt(10, (saltErr, salt) => {
            if(saltErr) return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
            else{
                bcrypt.hash(req.body.password, salt, (hashErr, hash) => {
                    if(hashErr) return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
                    else {
                        let newUser = new userModel({
                            email: req.body.email,
                            password: hash,
                            fullname: req.body.fullname,
                            confirmationCode: userHelper.getConfirmationCode()
                        })

                        newUser.save((saveErr, saveDoc) => {
                            if(saveErr && saveErr.code == 11000) return res.status(409).json({UserAlreadyExistsError: 'A user with this email already exists'})
                            else if(saveErr) return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
                            else if(saveDoc){
                                return res.status(201).json({message:'User registered successfully.'})
                            }
                        })
                    }
                })
            }
        })
    }
}

module.exports = {
    getAll: getAll,
    login: login,
    register: register
}