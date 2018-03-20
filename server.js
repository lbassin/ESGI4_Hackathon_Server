const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

let db = null;

const request = require('request');
const URL_THEMOVIEDB = 'https://api.themoviedb.org/3/';
const MODE_MOVIE_THEMOVIEDD = 'search/movie';
const MODE_TV_THEMOVIEDD = 'search/tv';
const API_KEY_THEMOVIEDB = '?api_key=e6bd501ead1bb2b3fee7f162744af579&';
const LANG_THEMOVIEDB = '&language=fr_FR';
const PAGE_THEMOVIEDB = '&page=1';
const ADULT_THEMOVIEDB = '&include_adult=true'

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const userId = req.headers.authorization;
    if (userId === undefined) {
        res.send({ error: true, message: 'Missing Authorization' });
    }

    ///////

    let url = URL_THEMOVIEDB + MODE_TV_THEMOVIEDD + API_KEY_THEMOVIEDB + LANG_THEMOVIEDB + PAGE_THEMOVIEDB + ADULT_THEMOVIEDB + '&query=' + JSON.stringify(req.body.question);
    console.log(url);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            for (var key in body.results) {
                console.log(body.results[key]);
            }
        }
    })

    ///////

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

