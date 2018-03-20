const getIdByName = require('../get_id_by_name');
const request = require('request');

const base_url = 'https://api.themoviedb.org/3/';
const end_url = '?api_key=e6bd501ead1bb2b3fee7f162744af579&language=fr-FR&page=1';

function getOutputData(show) {
    return new Promise((resolve, reject) => {
        const urlDetails = base_url + 'tv/' + show.id + end_url;
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
        const urlSimilar = base_url + 'tv/' + id + '/similar' + end_url;
        request(urlSimilar, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject();
            }

            let results = JSON.parse(body).results.slice(0, 5);

            let promises = [];
            for (let index in results) {
                promises.push(getOutputData(results[index]));
            }

            Promise.all(promises).then(data => {
                let output = {
                    type: 'card',
                    data: data
                };

                resolve(output);
            }).catch(error => console.log(error));
        });
    });
}

module.exports = (parameters) => {
    return new Promise(resolve => {
        getIdByName(parameters.TV_Name).then(id => {
            resolve(foundSimilarById(id));
        }).catch(error => {
            console.log(error);
        });
    })
};