const getIdByName = require('../get_id_by_name');
const config = require('../config');
const request = require('request');

const days = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
];

const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'
];

function getNextById(id) {
    return new Promise((resolve, reject) => {
        const url = config.URL_THEMOVIEDB + 'tv/' + id + '/external_ids' + config.API_KEY_THEMOVIEDB;

        request(url, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                reject();
            }

            let id = JSON.parse(body);

            const Xray = require('x-ray');
            let x = Xray();

            x('https://www.thetvdb.com/?tab=seasonall&id=' + id['tvdb_id'] + '&lid=17', '#listtable')(function (err, obj) {
                let date = obj.split('\n').map((el) => {
                    let tmp = el.trim();
                    return tmp.substr(tmp.length - 10);
                });
                let now = new Date().toISOString().slice(0, 10);
                let found = null;
                date.forEach((value, index) => {
                    let diff = new Date(now) - new Date(value);
                    if (diff < 0 && diff !== NaN && found == null) {
                        found = new Date(value);
                        let date = Date.parse(found);
                        date = new Date(date);

                        let outputDate = days[date.getDay()] + ' ' +
                            date.getDate() + ' ' + months[date.getMonth()] + ' ' +
                            date.getFullYear();

                        resolve({
                            type: 'text',
                            data: {
                                message: 'Le prochain épisode sera disponible le ' + outputDate,
                                vocal: 'Le prochain épisode sera disponible le ' + outputDate
                            }
                        });
                        return;
                    }
                });

                reject({
                    type: 'text',
                    data: {
                        message: 'Aucun épisode n\'a été trouvé',
                        vocal: 'Aucun épisode n\'est prévu pour le moment  '
                    }
                })
            })
        });
    });
}

module.exports = (parameters) => {
    return new Promise((resolve, reject) => {
        getIdByName(parameters.TV_Name)
            .then(id => resolve(getNextById(id)))
            .catch(error => reject(error));
    })
};
