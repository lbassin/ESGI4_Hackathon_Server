module.exports = {
    savePseudo: (req, db) => {
        let name = req.body.question;

        db.collection('users').findOne({'name': name}).then(user => {
            if (!user) {
                db.collection('users').insertOne({'name': name});
            }
        });
    },

    saveGenre: (req, db) => {
        let name = req.headers.authorization;

        db.collection('users').findOne({'name': name}).then(user => {
            if (user) {
                let genres = user.genres;
                if (!genres) {
                    genres = '[]';
                }
                genres = JSON.parse(genres);

                genres.push(2); // TODO

                user.genres = JSON.stringify(genres);

                console.log(user);
                db.collection('users').updateOne({'_id': user._id}, {$set: {genres: user.genres}}).then(() => {
                });
            }
        });
    }
};