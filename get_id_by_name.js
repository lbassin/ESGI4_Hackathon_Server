const getCardData = require('./get_card_data');
const config = require('./config');
const request = require('request');
const vars = require('./vars');

function getIndexBySoundex(name, results) {
    let soundexBase = soundex(name);

    for (let index in results) {
        if (!results.hasOwnProperty(index)) {
            continue;
        }

        const soundexResult = soundex(results[index].name);
        if (soundexBase === soundexResult) {
            return index;
        }
    }

    return 0;
}

function soundex(text) {
    let a = text.toLowerCase().split(''),
        f = a.shift(),
        r = '',
        codes = {
            a: '', e: '', i: '', o: '', u: '',
            b: 1, f: 1, p: 1, v: 1,
            c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
            d: 3, t: 3,
            l: 4,
            m: 5, n: 5,
            r: 6
        };

    r = f +
        a
            .map(function (v, i, a) {
                return codes[v]
            })
            .filter(function (v, i, a) {
                return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
            })
            .join('');

    return (r + '000').slice(0, 4).toUpperCase();
}

module.exports = (name) => {
    return new Promise((resolve, reject) => {
        let searchUrl = config.URL_THEMOVIEDB + 'search/tv' + config.API_KEY_THEMOVIEDB + '&page=1&query="' + name + '"';

        request(searchUrl, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject();
            }

            body = JSON.parse(body);
            let resultCount = 0;
            for (let index in body.results) {
                if (!body.results.hasOwnProperty(index)) {
                    continue;
                }

                if (!body.results[index].popularity || body.results[index].popularity < 1.2) {
                    continue;
                }

                resultCount++;
            }

            if (vars.forceConfirmation) {
                vars.forceConfirmation = null;
                const index = getIndexBySoundex(name, body.results);
                resolve(body.results[index].id);
                return;
            }

            if (resultCount === 1) {
                resolve(body.results[0].id);
                return;
            }

            const message = 'De quelle série parlez vous ?';
            const vocal = 'Plusieurs séries correspondent à votre recherche, de quelle série parlez vous ?';

            getCardData(body.results, message, vocal).then(data => {
                data.restartRecord = true;
                reject(data)
            });
        });
    });
};
