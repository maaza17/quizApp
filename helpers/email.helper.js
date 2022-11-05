const SendInBlue = require('sib-api-v3-sdk');
SendInBlue.ApiClient.instance.authentications['api-key'].apiKey = process.env.SIB_API_KEY

// function to send bulk email alert to entire user base, limited to 300 emails per day for free tier subscription
function newQuizAlert(data, callback){
    // [{email:"maaz.haque17@gmail.com", name:"Maaz Ul Haque"}]
    let mailList = data.mailList
    let quizName = data.quizName
    let quizTopic = data.quizTopic
    
    new SendInBlue.TransactionalEmailsApi().sendTransacEmail({
    
        "sender":{ "email":"maaz.haque17@gmail.com", "name":"Maaz Ul Haque - MetaSchool"},
        "subject":"METASCHOOL ANNOUNCEMENT - NEW QUIZ ADDED",
        "htmlContent":'<body><h2>Checkout this new addition to our list of available quizzes.</h2><br /><h3>'+ quizName +'</h3><br /><p> Log into our portal to have your go at this and find out how well you are at '+ quizTopic +'.</p><br /><p> Lets get started.</p><br /><br /><br /><p>Regards,</p><p>Team metaschool</p></body>',
        "messageVersions":[
          //Definition for Message
            {
                "to":mailList,
                "htmlContent":'<body><h2>Checkout this new addition to our list of available quizzes.</h2><br /><h3>'+ quizName +'</h3><br /><p> Log into our portal to have your go at this and find out how well you are at '+ quizTopic +'.</p><br /><p> Lets get started.</p><br /><br /><br /><p>Regards,</p><p>Team metaschool</p></body>',
                "subject":"METASCHOOL ANNOUNCEMENT - NEW QUIZ ADDED"
            }
       ]
    
    })
    .then(apiResponse => {
        return callback(null, apiResponse)
    })
    .catch(error => {
        return callback(error, null)
    })
}

function registerAlert(data, callback){
    let verificationURL = process.env.BASE_URL + '/api/users/verifyEmail/' + data.confirmationCode
    let mailList = [{email: data.email, name: data.name}]

    new SendInBlue.TransactionalEmailsApi().sendTransacEmail({
    
        "sender":{ "email":"maaz.haque17@gmail.com", "name":"Maaz Ul Haque - MetaSchool"},
        "subject":"METASCHOOL QUIZ-APP EMAIL VERIFICATION",
        "htmlContent":'<body><h3>Hello ' + data.name + '</h3><br /><p> Thank you for registering on the metaschool quiz app.</p><br /><p> Lets get started. Please verify your account by following this link :</p><br /><br /><a href="'+ verificationURL + '">Verify Account</a><br /><br /><p>Looking forward to have you flex your brain muscles with us.</p><br /><br /><p>Regards,</p><p>Team metaschool</p></body>',
        "messageVersions":[
          //Definition for Message
            {
                "to":mailList,
                "htmlContent":'<body><h3>Hello ' + data.name + '</h3><br /><p> Thank you for registering on the metaschool quiz app.</p><br /><p> Lets get started. Please verify your account by following this link :</p><br /><br /><a href="'+ verificationURL + '">Verify Account</a><br /><br /><p>Looking forward to have you flex your brain muscles with us.</p><br /><br /><p>Regards,</p><p>Team metaschool</p></body>',
                "subject":"METASCHOOL QUIZ-APP EMAIL VERIFICATION",
            }
       ]
    
    })
    .then(apiResponse => {
        return callback(null, apiResponse)
    })
    .catch(error => {
        return callback(error, null)
    })
}

module.exports = {
    newQuizAlert: newQuizAlert,
    registerAlert: registerAlert
}