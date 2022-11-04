const jwt = require('jsonwebtoken')
const isEmpty = require('is-empty')

function verifyToken(token, callback){
    if(isEmpty(token)){
        return callback({AuthError: 'Please sign in to continue.'}, null)
    } else {
        jwt.verify(token, process.env.ENCRYPTION_SECRET, (err, decoded) => {
            if(err) return callback({SessionExpired: 'Please sign in again to continue.'}, null)
            else return callback(null, decoded)
        })
    }
}


module.exports = {
    verifyToken: verifyToken
}