const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
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

    console.log(userId);
    console.log(req.body);

    db.collection('question').insertOne(req.body);

    const data = {
        'value': 4
    };

    res.send(JSON.stringify(data));
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

