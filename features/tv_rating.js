const request = require('request');
const URL_THEMOVIEDB = 'https://api.themoviedb.org/3/';
const MODE_MOVIE_THEMOVIEDD = 'search/movie';
const MODE_TV_THEMOVIEDD = 'search/tv';
const API_KEY_THEMOVIEDB = '?api_key=e6bd501ead1bb2b3fee7f162744af579&';
const LANG_THEMOVIEDB = '&language=fr_FR';
const PAGE_THEMOVIEDB = '&page=1';
const ADULT_THEMOVIEDB = '&include_adult=true';

module.exports = (parameters) => {
    return new Promise(resolve => {
        const name = parameters.TV_Name;
        const url = URL_THEMOVIEDB + MODE_TV_THEMOVIEDD + API_KEY_THEMOVIEDB + LANG_THEMOVIEDB + PAGE_THEMOVIEDB + ADULT_THEMOVIEDB + '&query=' + name;

        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                let show = body.results[0];

                resolve(show.vote_average);
            }
        });
    });
};
