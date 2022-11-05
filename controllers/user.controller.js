const jwt = require('jsonwebtoken')
const emailHelper = require('../helpers/email.helper')
const userHelper = require('../helpers/user.helper')
const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const isEmpty = require('is-empty')

function getAll(req, res) {

    userModel.find({}, {name: true, email: true, dateCreated: true})
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
        userModel.findOne({email: req.body.email})
        .then(doc => {
            if(doc.status == 'unverified') return res.status(401).json({UnverifiedUser: 'Please verify registered email to login.'})
            bcrypt.compare(req.body.password, doc.password)
            .then(isMatch => {
                if(!isMatch) return res.status(401).json({IncorrectPasswordError: 'Passwords do not match.'})
                else {
                    let payload = {
                        _id: doc._id,
                        name: doc.name,
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
                            name: req.body.name,
                            confirmationCode: userHelper.getConfirmationCode()
                        })

                        newUser.save((saveErr, saveDoc) => {
                            if(saveErr && saveErr.code == 11000) return res.status(409).json({UserAlreadyExistsError: 'A user with this email already exists'})
                            else if(saveErr) return res.status(500).json({UnexpectedError: 'An unexpected error occurred. Please try again later.'})
                            else if(saveDoc){
                                emailHelper.registerAlert({email: saveDoc.email, name: saveDoc.name, confirmationCode: saveDoc.confirmationCode}, (mailErr, mailInfo) => {
                                    if(mailErr) return res.status(201).json({RegistrationSuccessful: 'User registration successful. Verification email not sent.'})
                                    else return res.status(201).json({message:'User registered successfully.'})
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

function verifyEmail(req, res){
    if(isEmpty(req.params.confCode)) return res.status(400).json({InvalidVerificationLink: 'Verification link is broken.'})
    else {
        userModel.findOne({confirmationCode: req.params.confCode})
        .then(user => {
            if(isEmpty(user)) return res.status(404).json({ResourceNotFoundError: 'Specified user not found or does not exist.'})
            else if(user.status == 'verified') return res.status(200).json({UserAlreadyVerified: 'Specified user email has already been verified.'})
            else {
                user.status = 'verified'
                user.save()
                .then(verifiedUser => {
                    return res.status(200).json({VerificationSuccessful: 'Specified user email verified successfully.'})
                })
            }
        })
        .catch(err => {
            return res.status(500).json({UnexpectedError: 'An unexpected error occured, please try again later.'})
        })
    }
}

module.exports = {
    getAll: getAll,
    login: login,
    register: register,
    verifyEmail: verifyEmail
}