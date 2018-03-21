const cleanParameters = require('./clean_parameters');
const MongoClient = require('mongodb').MongoClient;
const cleanQuestion = require('./clean_question');
const bodyParser = require('body-parser');
const askBot = require('./ask_bot');
const express = require('express');
const init = require('./init');
const vars = require('./vars');
const cors = require('cors');

const app = express();
let db = null;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const userId = req.headers.authorization;
    if (userId === undefined) {
        res.send({error: true, message: 'Missing Authorization'});
    }

    let sessionId = null;
    if (req.body.session) {
        sessionId = req.body.session;
    }

    let question = cleanQuestion(req.body.question);
    askBot(question, sessionId).then(response => {
        console.log(response.action);
        let parameters = cleanParameters(response.parameters);

        if (parameters.Confirmation) {
            vars.forceConfirmation = true;
        }

        let callback = null;
        try {
            callback = require('./features/' + response.action);
        } catch (error) {
        }

        if (!callback) {
            res.send({
                type: 'text', data: {
                    message: 'Je ne suis pas sur d\'avoir compris votre demande',
                    vocal: 'Je ne suis pas sur d\'avoir compris votre demande',
                }
            });
            return;
        }

        callback(parameters).then(data => {
            res.send(JSON.stringify(data));
        }).catch(error => {
            res.send(JSON.stringify(error));
        });
    });
});

app.post('/init/', (req, res) => {
    let response = {};

    switch (req.body.session) {
        case 'genre':
            response = {
                type: 'init_done', data: {
                    message: 'Merci, vous pouvez maintenant utiliser nos services',
                    vocal: '',
                },
                session: null
            };
            init.saveGenre(req, db);
            break;
        default:
            response = {
                type: 'init', data: {
                    message: 'Merci, quel genre de série ou film aimez vous regarder ?',
                    pseudo: req.body.question,
                    vocal: '',
                },
                session: 'genre'
            };
            init.savePseudo(req, db);
            break;
    }

    res.send(response);
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

