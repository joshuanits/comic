const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'https://www.exocomics.com/';

class ExoComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'exo';
        this.info.name = 'Extra Ordinary';
        this.info.author = 'Li Chen';
        this.info.authorUrl = 'https://www.exocomics.com/';
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        return new Promise(function(resolve, reject) {
            try {
                const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}${id}`;

                axios.get(requestUrl)
                    .then(function(response) {
                        if (response.status != 200) {
                            throw (`http status ${response.status}`);
                        }

                        const comic = new ExoComic();

                        // Fetch comic data from response
                        const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
                        const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
                        const imageNode = select('//*[@class=\'image-style-main-comic\']', doc)[0];

                        // Image url
                        comic.imageUrl = imageNode.getAttribute('src');

                        // Comic title
                        comic.name = imageNode.getAttribute('title');

                        // Comic id
                        comic.id = imageNode.getAttribute('alt');

                        // Comic url
                        comic.url = siteUrl + comic.id;

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
        return new ExoComic().info;
    }
}

module.exports = ExoComic;