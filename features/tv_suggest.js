const getCardData = require('../get_card_data');
const config = require('../config');
const request = require('request');

module.exports = (parameters, db) => {
    return new Promise((resolve, reject) => {
        console.log(parameters);
        db.collection('users').findOne({name: parameters.user}).then(user => {
            if (!user) {
                reject({
                    type: 'text',
                    data: {
                        message: 'Je ne vous trouve pas dans ma base de donnée, avez vous essayé d\'éteindre et de redemarrer Djingo ?'
                    }
                });
            }

            let genres = JSON.parse(user.genres);
            const url = config.URL_THEMOVIEDB + 'discover/tv' + config.API_KEY_THEMOVIEDB;
            let filters = '&with_genres=' + genres.join(',');
            request(url + filters, (error, response, body) => {
                body = JSON.parse(body);

                let suggest = [];
                for (let i = 0; i < 5; i++) {
                    let index = parseInt((String)(Math.random() * (body.results.length - 1)));
                    let data = body.results[index];

                    if (suggest.includes(data) && index < (body.results.length - 1)) {
                        data = body.results[index + 1]
                    }

                    suggest.push(data);
                }

                getCardData(suggest,
                    'Voici quelques séries qui pourraient vous plaire',
                    'En m\'aidant de vos habitudes j\'ai pu trouver plusieurs séries susceptible de vous plaire')
                    .then(data => {
                    resolve(data);
                });
            });
        });
    });
};