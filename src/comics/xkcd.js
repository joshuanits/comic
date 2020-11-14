const BaseComic = require('./base');

const axios = require('axios');

const siteUrl = 'https://xkcd.com/';

class XKCDComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'xkcd';
        this.info.name = 'xkcd';
        this.info.author = 'xkcd';
        this.info.authorUrl = 'https://xkcd.com';
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        return new Promise(function(resolve, reject) {
            try {
                const requestUrl = (id == 'latest') ? `${siteUrl}info.0.json` : `${siteUrl}${id}/info.0.json`;

                axios.get(requestUrl)
                    .then(function(response) {
                        if (response.status != 200) {
                            throw (`http status ${response.status}`);
                        }

                        const comic = new XKCDComic();

                        // Fetch comic data from response
                        const data = response.data;

                        comic.id = data.num.toString();
                        comic.imageUrl = data.img;
                        comic.name = data.title;
                        comic.url = `${siteUrl}${comic.id}`;

                        resolve(comic);
                    }).catch(function(error) {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    static getInfo() {
        return new XKCDComic().info;
    }
}

module.exports = XKCDComic;