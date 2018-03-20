const config = require('../config');
const request = require('request');

module.exports = (parameters) => {
    return new Promise(resolve => {
        const name = parameters.TV_Name;
        const url_search = config.URL_THEMOVIEDB +
            'search/movie' +
            config.API_KEY_THEMOVIEDB +
            '&language=fr_FR' +
            '&query=' + name;

        request(url_search, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                let show = body.results[0];

                const name = parameters.TV_Name;
                const url = config.URL_THEMOVIEDB +
                    'movie/' +
                    show.id + '/videos' +
                    config.API_KEY_THEMOVIEDB +
                    'language=fr_FR' +
                    '&include_adult=true'

                request(url, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        body = JSON.parse(body);
                        let trailer = body.results[0];

                        resolve("https://www.youtube.com/watch?v=" + trailer.key);
                    }
                });
            }
        });
    });
};
