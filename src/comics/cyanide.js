const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'https://explosm.net/';

class CyanideComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'cyanide';
        this.info.name = 'Cyanide and Happiness';
        this.info.author = 'Explosm';
        this.info.authorUrl = 'http://explosm.net/';
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        return new Promise(function(resolve, reject) {
            try {
                const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comics/${id}`;

                axios.get(requestUrl)
                    .then(function(response) {
                        if (response.status != 200) {
                            throw (`http status ${response.status}`);
                        }

                        const comic = new CyanideComic();

                        // Fetch comic data from response
                        const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
                        const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
                        const imageNode = select('//*[@id=\'main-comic\']', doc)[0];

                        // Image url
                        comic.imageUrl = 'https:' + imageNode.getAttribute('src');

                        const authorNode = select('//*[@id=\'comic-author\']', doc)[0];

                        // Comic title
                        comic.name = authorNode.textContent;

                        if (id == 'latest') {
                            const linkNode = select('//*[@id=\'comic-social-link\']', doc)[0];

                            // Comic url example http://explosm.net/comics/5705
                            comic.url = linkNode.getAttribute('href');

                            // Comic id
                            comic.id = comic.url.split('/').slice(-1)[0];
                        } else {
                            comic.url = requestUrl;
                            comic.id = id;
                        }

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
        return new CyanideComic().info;
    }
}

module.exports = CyanideComic;