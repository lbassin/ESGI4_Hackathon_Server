const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function () {
    console.log('listening on 3000')
});

app.post('/api/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const userId = req.headers.authorization;
    if (userId === undefined) {
        res.send({error: true, message: 'Missing Authorization'});
    }

    console.log(userId);
    console.log(req.body);

    const data = {
        'value': 4
    };

    res.send(JSON.stringify(data));
});