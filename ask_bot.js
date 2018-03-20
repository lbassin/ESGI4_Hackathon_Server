const apiai = require('apiai');
const bot = apiai('8e13b824185d4685a549e5692ee83918');
const vars = require('./vars');
const uuid = require('uuid');

module.exports = function askBot(question, sessionId) {
    return new Promise(resolve => {
        if (!sessionId) {
            sessionId = uuid();
            vars.sessionId = sessionId;
        }

        const botData = {sessionId: sessionId};
        const request = bot.textRequest(question, botData);

        console.log(vars.sessionId);

        request.on('response', data => {
            resolve(data.result);
        });

        request.end();
    })
};
