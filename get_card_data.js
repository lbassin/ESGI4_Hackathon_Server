const config = require('./config');
const request = require('request');
const vars = require('./vars');

function getOutputData(show) {
    return new Promise((resolve, reject) => {
        const urlDetails = config.URL_THEMOVIEDB + 'tv/' + show.id + config.API_KEY_THEMOVIEDB + '&page=1';
        request(urlDetails, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject();
            }

            body = JSON.parse(body);

            const genres = body.genres;
            let selectedGenre = parseInt((String)(Math.random() * (genres.length - 1)));
            if (!genres[selectedGenre]) {
                genres[selectedGenre] = '';
            }

            resolve({
                title: show.name,
                media: 'https://image.tmdb.org/t/p/w400' + show.poster_path,
                caption: genres[selectedGenre].name,
                overview: show.overview,
                poster: 'https://image.tmdb.org/t/p/original' + show.backdrop_path
            });
        });
    });
}

module.exports = (results, message, vocal) => {
    return new Promise(resolve => {
        let promises = [];
        for (let index in results) {
            if (!results.hasOwnProperty(index)) {
                continue;
            }

            if (!results[index]) {
                continue;
            }

            if (!results[index].popularity || results[index].popularity < 1.2) {
                continue;
            }

            promises.push(getOutputData(results[index]));
        }

        Promise.all(promises).then(data => {
            let output = {
                type: 'card',
                data: {
                    message: message,
                    vocal: vocal,
                    cards: data
                },
                session: vars.sessionId
            };

            if (output.data.cards.length === 0) {
                resolve({
                    type: 'text',
                    data: {
                        message: 'Je ne trouve pas d\'information à ce sujet',
                        vocal: 'Je suis désolé, je n\'ai rien trouvé à ce sujet'
                    }
                });
            }

            resolve(output);
        }).catch(error => console.log(error));
    })
};
