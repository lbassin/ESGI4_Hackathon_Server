const cleanQuestion = require('./clean_question');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const askBot = require('./ask_bot');
const express = require('express');
const cors = require('cors');

const app = express();
let db = null;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const userId = req.headers.authorization;
    if (userId === undefined) {
        res.send({error: true, message: 'Missing Authorization'});
    }

    let question = cleanQuestion(req.body.question);
    askBot(question).then(response => {
        console.log(response.action);
        console.log(response.parameters);

        // console.log(userId);
        // console.log(req.body);

        res.send(JSON.stringify({}));
    });

});

MongoClient.connect('mongodb://127.0.0.1:27017', (error, client) => {
    if (error) {
        console.log(error);
        return;
    }

    db = client.db('hackathon');

    app.listen(3000, function () {
        console.log('listening on 3000')
    });
});

