const BaseComic = require('./base');

const axios = require('axios');
const DOMParser = require('xmldom').DOMParser;
const xpath = require('xpath');

const siteUrl = 'https://www.channelate.com/';

class ChannelateComic extends BaseComic {
    constructor() {
        super();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'channelate';
        this.info.name = 'Channelate';
        this.info.author = 'Ryan Hudson';
        this.info.authorUrl = 'https://www.channelate.com/';
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

                        const comic = new ChannelateComic();

                        // Fetch comic data from response
                        const doc = new DOMParser({ errorHandler: { warning: null } }).parseFromString(response.data);
                        const select = xpath.useNamespaces({ 'html': 'http://www.w3.org/1999/xhtml' });
                        const imageNode = select('//html:span[@class=\'comic-square\']/html:img', doc)[0];

                        // Image url
                        comic.imageUrl = imageNode.getAttribute('src');

                        // Comic title
                        comic.name = imageNode.getAttribute('title');

                        if (id == 'latest') {
                            const titleNode = select('//html:h2[@class=\'post-title\']/html:a', doc)[0];

                            // Comic url example https://www.channelate.com/comic/bedtime-story-2/
                            comic.url = titleNode.getAttribute('href');

                            // Comic id
                            comic.id = comic.url.split('/').slice(-2)[0];
                        } else {
                            comic.url = requestUrl;
                            comic.id = id;
                        }

                        const bonusNode = select('//html:div[@id=\'extrapanelbutton\']/html:a', doc);
                        if(bonusNode.length > 0) {
                            // Bonus url
                            comic.bonusUrl = bonusNode[0].getAttribute('href');
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
        return new ChannelateComic().info;
    }
}

module.exports = ChannelateComic;