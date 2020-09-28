const express = require('express');
const app = express();
const router = require('./routers/router');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./db');
const {PORT} = config;
const appName = "Redcarpetup API";
db.connect();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', (req, res) => {
    res.send(`Welcome to ${appName}`)
})

app.use(router)

app.use('/uploads',express.static('uploads'));

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(PORT, ()=> { console.log(`${appName} is running on port no ${PORT}`)});