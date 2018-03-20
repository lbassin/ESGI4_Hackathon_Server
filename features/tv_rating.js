const config = require('../config');
const request = require('request');

module.exports = (parameters) => {
    return new Promise(resolve => {
        const name = parameters.TV_Name;
        const url = config.URL_THEMOVIEDB +
            'search/movie' +
            config.API_KEY_THEMOVIEDB +
            '&language=fr_FR' +
            '&page=1' +
            '&include_adult=true' +
            '&query=' + name;

        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                let show = body.results[0];

                resolve(show.vote_average);
            }
        });
    });
};