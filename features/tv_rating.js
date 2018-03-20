const getIdByName = require('../get_id_by_name');
const request = require('request');

const base_url = 'https://api.themoviedb.org/3/';
const end_url = '?api_key=e6bd501ead1bb2b3fee7f162744af579&language=fr-FR&page=1';

function getRatingById(id) {
    console.log(id);
    return new Promise(resolve => {
        const url = base_url + 'tv/' + id + end_url;

        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let show = JSON.parse(body);

                resolve({
                    type: 'text',
                    data: {
                        message: show.vote_average
                    }
                });
            }
        });
    });
}

module.exports = (parameters) => {
    return new Promise((resolve, reject) => {
        getIdByName(parameters.TV_Name)
            .then(id => resolve(getRatingById(id)))
            .catch(error => reject(error));
    })
};
