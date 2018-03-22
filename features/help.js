module.exports = () => {
    return new Promise(resolve => {
        let output = {
            type: 'help',
            data: {
                message: '',
                vocal: '',
                helps: [
                    {
                        title: 'test',
                        desc: 'desc',
                        button: 'ok'
                    }, {
                        title: 'test',
                        desc: 'desc',
                        button: 'ok'
                    }
                ]
            }
        };

        resolve(output);
    })
};