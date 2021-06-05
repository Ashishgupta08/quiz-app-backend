require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

const check = process.env.DB_HOST

app.get('/', (req, res) => {
    res.send(check)
});

app.get('/user', (req, res) => {
    res.json({username: "admin", password: "admin"})
});

app.listen(3000, () => {
    console.log('server started');
}); 