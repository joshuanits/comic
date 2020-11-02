const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'https://www.smbc-comics.com/';

class SMBCComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'smbc';
        this.info.name = 'Saturday Morning Breakfast Cereal';
        this.info.author = 'Zach Weinersmith';
        this.info.authorUrl = 'https://www.smbc-comics.com';
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

                        const comic = new SMBCComic();

                        // Fetch comic data from response
                        const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
                        const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
                        const imageNode = select('//*[@id=\'cc-comic\']', doc)[0];

                        // Image url
                        comic.imageUrl = imageNode.getAttribute('src');

                        // Comic title
                        comic.name = imageNode.getAttribute('title');

                        const linkNode = select('//*[@id=\'permalinktext\']', doc)[0];

                        // Comic url
                        comic.url = linkNode.getAttribute('value');

                        // Comic id
                        comic.id = comic.url.split('/').slice(-1)[0];

                        // Bonus image
                        const bonusNode = select('//*[@id=\'aftercomic\']', doc)[0];

                        if(bonusNode != undefined) {
                            comic.bonusUrl = bonusNode.firstChild.getAttribute('src');
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
        return new SMBCComic().info;
    }
}

module.exports = SMBCComic;