const getCardData = require('./get_card_data');
const config = require('./config');
const request = require('request');

module.exports = (name) => {
    return new Promise((resolve, reject) => {
        let searchUrl = config.URL_THEMOVIEDB + 'search/tv' + config.API_KEY_THEMOVIEDB + '&page=1&query="' + name + '"';

        request(searchUrl, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject();
            }

            body = JSON.parse(body);
            if (body.total_results === 1) {
                resolve(body.results[0].id);
                return;
            }

            getCardData(body.results, 'Plusieurs choix :').then(data => reject(data));
        });
    });
};