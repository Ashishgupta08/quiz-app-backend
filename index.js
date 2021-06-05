const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello Express app!')
});

app.get('/user', (req, res) => {
    res.send({username: "admin", password: "admin"})
});

app.listen(3000, () => {
    console.log('server started');
});