const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
require("dotenv").config();

const userRoute = require('./routes/user.route')
const quizRoute = require('./routes/quiz.route')
const attemptRoute = require('./routes/attempt.route')

const app = express();
app.use(helmet())

app.use(express.urlencoded({ extended: true, limit: 20000000 }));
app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


// logging middleware
app.use(function(req, res, next) {
    console.log(`${req.method} ${req.url} ${Date().toString()}`)
    next()
})

app.get('/', (req, res) => {
    return res.status(200).json({
        author: "Maaz Ul Haque",
        description: "This is a demo application for metaschool.so",
        repository: "https://github.com/maaza17/quizApp",
        note: "Please download the postman collection hosted in the same repository & import into your postman client to interact with already formatted APIs. POST data is sent in the body in json format.",
        linkToPostmanCollection: "https://github.com/maaza17/quizApp/blob/main/maazulhaque-quiz-app-postman-APIs.postman_collection.json"
    })
})

app.use('/api/users', userRoute)
app.use('/api/quiz', quizRoute)
app.use('/api/attempt', attemptRoute)

mongoose
    .connect(
        process.env.DB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log(err));


const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log('Server running on port ' + port)

})