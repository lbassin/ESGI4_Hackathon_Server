const config = require('../config');
const request = require('request');

module.exports = (parameters) => {
    return new Promise((resolve, reject) => {
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

                if (!show) {
                    reject({
                        type: 'text',
                        data: {
                            message: 'Je ne trouve pas de trailer pour ce film',
                            vocal: 'Je suis désolé, je n\'ai pas trouvé de trailer pour ce film'
                        }
                    });
                    return;
                }

                const name = parameters.TV_Name;
                const url = config.URL_THEMOVIEDB +
                    'movie/' +
                    show.id + '/videos' +
                    config.API_KEY_THEMOVIEDB +
                    '&include_adult=true';

                request(url, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        body = JSON.parse(body);
                        let trailer = body.results[0];

                        if (!trailer) {
                            reject({
                                type: 'text',
                                data: {
                                    message: 'Je ne trouve pas ce film',
                                    vocal: 'Je ne trouve pas ce film',
                                }
                            });
                            return;
                        }

                        resolve({
                            type: 'video',
                            data: {
                                video: {
                                    media: 'https://www.youtube.com/embed/' + trailer.key + '?autoplay=1',
                                },
                                message: 'Je lance la lecture du trailer',
                                vocal: 'Voici le traileur',
                            }
                        });
                    }
                });
            }
        });
    });
};
