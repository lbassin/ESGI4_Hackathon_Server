const getIdByName = require('../get_id_by_name');
const getCardData = require('../get_card_data');
const config = require('../config');
const request = require('request');

function getOutputData(show) {
    return new Promise((resolve, reject) => {
        const urlDetails = config.URL_THEMOVIEDB + 'tv/' + show.id + config.API_KEY_THEMOVIEDB + '&page=1';

        request(urlDetails, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject();
            }

            const genres = JSON.parse(body).genres;
            let selectedGenre = parseInt((String)(Math.random() * (genres.length - 1)));

            resolve({
                title: show.name,
                media: 'https://image.tmdb.org/t/p/w400' + show.poster_path,
                caption: genres[selectedGenre].name,
            });
        });
    });
}

function foundSimilarById(id) {
    return new Promise((resolve, reject) => {
        const urlSimilar = config.URL_THEMOVIEDB + 'tv/' + id + '/similar' + config.API_KEY_THEMOVIEDB + '&page=1';

        request(urlSimilar, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject();
            }

            let results = JSON.parse(body).results.slice(0, 5);

            getCardData(results,
                'J\'ai trouvé plusieurs séries similaires',
                'J\'ai trouvé plusieurs séries similaires qui pourraient vous plaire')
                .then(data => resolve(data));
        });
    });
}

module.exports = (parameters) => {
    return new Promise((resolve, reject) => {
        getIdByName(parameters.TV_Name)
            .then(id => resolve(foundSimilarById(id)))
            .catch(error => reject(error));
    })
};