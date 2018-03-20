const getIdByName = require('../get_id_by_name');
const config = require('../config');
const request = require('request');

function getRatingById(id) {
    console.log(id);
    return new Promise(resolve => {
        const url = config.URL_THEMOVIEDB + 'tv/' + id + config.API_KEY_THEMOVIEDB + '&page=1';

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
