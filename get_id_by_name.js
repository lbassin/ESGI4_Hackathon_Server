const getCardData = require('./get_card_data');
const request = require('request');

const base_url = 'https://api.themoviedb.org/3/';
const end_url = '?api_key=e6bd501ead1bb2b3fee7f162744af579&language=fr-FR&page=1';

module.exports = (name) => {
    return new Promise((resolve, reject) => {
        let searchUrl = base_url + 'search/tv' + end_url + '&query="' + name + '"';
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