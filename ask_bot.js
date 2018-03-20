const uuid = require('uuid/v4');
const apiai = require('apiai');
const bot = apiai('8e13b824185d4685a549e5692ee83918');

module.exports = function askBot(question, sessionId) {
    return new Promise(resolve => {
        if (!sessionId) {
            sessionId = uuid();
        }

        const botData = {sessionId: sessionId};
        const request = bot.textRequest(question, botData);

        request.on('response', data => {
            resolve(data.result);
        });

        request.end();
    })
};
