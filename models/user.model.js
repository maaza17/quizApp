const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    confirmationCode:{
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['unverified', 'verified'],
        default: 'unverified'
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const userModel = new mongoose.model('user', userSchema)
module.exports = userModel