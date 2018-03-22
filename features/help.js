module.exports = () => {
    return new Promise(resolve => {
        let output = {
            type: 'help',
            data: {
                message: 'Voici l\'aide disponible',
                vocal: 'Voici comment je peux vous aider',
                helps: [
                    {
                        title: 'Avoir des séries similaires',
                        desc: 'Dites : donne moi les séries similaires à {nom de votre série}',
                        button: 'Séries similaire'
                    }, {
                        title: 'Connaitre la sortie du prochain épisode d\'une série',
                        desc: 'Dites : quand sort le prochain épisode de {nom de votre série}',
                        button: 'Prochain épisode'
                    }, {
                        title: 'Avoir le trailer d\'un film',
                        desc: 'Dites : montre moi le trailer de {nom de votre film}',
                        button: 'Trailer'
                    }, {
                        title: 'Connaitre la note d\'une série',
                        desc: 'Dites : quels sont les avis sur {nom de votre série}',
                        button: 'Note'
                    }
                ]
            }
        };

        resolve(output);
    })
};