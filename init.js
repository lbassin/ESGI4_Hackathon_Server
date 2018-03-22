const request = require('request');
const config = require('./config');

module.exports = {
    savePseudo: (req, db) => {
        let name = req.body.question;
        name = name.toLowerCase();

        db.collection('users').findOne({'name': name}).then(user => {
            if (!user) {
                db.collection('users').insertOne({'name': name});
            }
        });
    },

    saveGenre: (req, db) => {
        return new Promise((resolve, reject) => {
            let name = req.headers.authorization.toLowerCase();
            let genre = req.body.question.toLowerCase();

            const urlSimilar = config.URL_THEMOVIEDB + 'genre/tv/list' + config.API_KEY_THEMOVIEDB;

            request(urlSimilar, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    return;
                }

                let genresAvailables = [];
                let found = false;
                body = JSON.parse(body);
                for (let index in body.genres) {
                    if (!body.genres.hasOwnProperty(index)) {
                        continue;
                    }

                    const regex = new RegExp(genre, "i");
                    if (body.genres[index].name.toLowerCase().match(regex)) {
                        found = true;
                        db.collection('users').findOne({'name': name}).then(user => {
                            if (user) {
                                let genres = user.genres;
                                if (!genres) {
                                    genres = '[]';
                                }
                                genres = JSON.parse(genres);
                                if (!genres.includes(body.genres[index].id)) {
                                    genres.push(body.genres[index].id);
                                }

                                user.genres = JSON.stringify(genres);

                                db.collection('users').updateOne({'_id': user._id}, {$set: {genres: user.genres}}).then(() => {
                                    resolve();
                                }).catch(() => reject(genresAvailables));
                            }
                        });
                    }
                    genresAvailables.push(body.genres[index].name);
                }

                if (!found) {
                    reject(genresAvailables);
                }
            });
        });
    }
};