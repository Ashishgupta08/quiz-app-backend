require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const URI = process.env.URI;
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true})
                        .then(()=>console.log("\n <===== Connected =====> \n"))
                        .catch(e=>console.log(" \n Could not connect to database. \n Error :- ", e));

app.get('/', (req, res) => {
    res.send("Welcome to the server of Quizo App.")
});

const user = require('./routes/user.router')
app.use('/user', user)

const quiz = require('./routes/quiz.router')
app.use('/quiz', quiz)

const leaderBoard = require('./routes/leaderboard.router')
app.use('/leaderBoard', leaderBoard)

app.use('*', (req, res) => {
    res.status(404).send("Error 404 - Page not found.")
});

app.listen(PORT, () => {
    console.log(`\n Server Started at port no - ${PORT}`);
}); 