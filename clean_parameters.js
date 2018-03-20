module.exports = function (parameters) {

    for (let name in parameters) {
        let value = parameters[name];

        if (value[value.length - 1] === '\n') {
            value = value.slice(0, -1);
        }

        if (value[value.length - 1] === '?') {
            value = value.slice(0, -1);
        }

        if (value[value.length - 1] === ' ') {
            value = value.slice(0, -1);
        }

        parameters[name] = value;
    }

    return parameters;
};
