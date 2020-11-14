const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'https://www.wildelifecomic.com/';

class WildelifeComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'wildelife';
        this.info.name = 'Wildelife';
        this.info.author = 'Pascalle Lepas';
        this.info.authorUrl = 'https://www.wildelifecomic.com/';
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        return new Promise(function(resolve, reject) {
            try {
                const requestUrl = (id == 'latest') ? siteUrl : `${siteUrl}comic/${id}`;

                axios.get(requestUrl)
                    .then(function(response) {
                        if (response.status != 200) {
                            throw (`http status ${response.status}`);
                        }

                        const comic = new WildelifeComic();

                        // Fetch comic data from response
                        const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
                        const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
                        const imageNode = select('//*[@id=\'cc-comic\']', doc)[0];

                        // Image url
                        comic.imageUrl = imageNode.getAttribute('src');

                        // Comic title
                        comic.name = imageNode.getAttribute('title');

                        const idNode = select('//*[@class=\'cc-newsheader\']', doc)[0];

                        // Comic id
                        if(idNode.firstChild) {
                            comic.id = idNode.firstChild.textContent;
                        } else {
                            comic.id = idNode.textContent;
                        }

                        // Comic url
                        comic.url = `${siteUrl}comic/${comic.id}`;

                        // Comic id
                        comic.id = comic.url.split('/').slice(-1)[0];


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
        return new WildelifeComic().info;
    }
}

module.exports = WildelifeComic;