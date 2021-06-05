const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Express app!')
});

app.get('/user', (req, res) => {
    res.json({username: "admin", password: "admin"})
});

app.listen(3000, () => {
    console.log('server started');
}); 