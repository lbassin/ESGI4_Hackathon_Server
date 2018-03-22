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

                let vocal = '';
                let vocal_note = show.vote_average.toString();
                vocal_note = vocal_note.replace('.', ' virgule ') + ' sur 10';
                if (show.vote_average < 6) {
                    vocal = "Cette série n'est pas très apprécié, sa note est de : " + vocal_note;
                } else {
                    vocal = "Cette série est plutôt apprécié, sa note est de " + vocal_note;
                }

                resolve({
                    type: 'text',
                    data: {
                        message: 'Cette série à une note de ' + show.vote_average + '/10',
                        vocal: vocal
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
