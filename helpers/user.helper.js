const jwt = require('jsonwebtoken')
const validator = require('validator')
const isEmpty = require('is-empty')
const bcrypt = require('bcryptjs')

function getConfirmationCode() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let confCode = '';
    for (let i = 0; i < 25; i++) {
      confCode += characters[Math.floor(Math.random() * characters.length)];
    }
    return confCode
}

function validateLoginInput(data){
    let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : ""
  data.password = !isEmpty(data.password) ? data.password : ""

  // Email checks
  if (validator.isEmpty(data.email)) {
    errors.EmailRequired = "Email field is required"
  } else if (!validator.isEmail(data.email)) {
    errors.InvalidEmail = "Email is invalid"
  }

  // Password checks
  if (validator.isEmpty(data.password)) {
    errors.PasswordRequired = "Password field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

function validateRegisterInput(data){
    let errors = {};
  
    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : ""
    data.email = !isEmpty(data.email) ? data.email : ""
    data.password = !isEmpty(data.password) ? data.password : ""
    
    // name checks
    if (validator.isEmpty(data.name)) {
        errors.NameRequired = "Full Name is required"
    }
    
    // Email checks
    if (validator.isEmpty(data.email)) {
      errors.EmailRequired = "Email is required"
    } else if (!validator.isEmail(data.email)) {
      errors.InvalidEmail = "Email is invalid"
    }
  
    // Password checks
    if (validator.isEmpty(data.password)) {
      errors.PasswordRequired = "Password field is required"
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    }
}

module.exports = {
    getConfirmationCode: getConfirmationCode,
    validateLoginInput: validateLoginInput,
    validateRegisterInput: validateRegisterInput
}