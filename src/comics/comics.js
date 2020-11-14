const { MessageEmbed } = require('discord.js');
const { AddComicInfo, GetComicInfoAll } = require('../database');

const ChannelateComic = require('./channelate');
const CyanideComic = require('./cyanide');
const ExoComic = require('./exo');
const SMBCComic = require('./smbc');
const SwordsComic = require('./swords');
const WhiteNoiseComic = require('./whitenoise');
const WildelifeComic = require('./wildelife');
const XKCDComic = require('./xkcd');

function GetComic(webcomic_id, comic_id) {
    for (let i = 0; i < ComicList.length; i++) {
        const comic = ComicList[i];
        if(comic.getInfo().id == webcomic_id) {
            return comic.getComicWithId(comic_id);
        }
    }

    throw('comic not found');
}

function GetComicEmbed(webcomic_id, comic_id) {
    return GetComic(webcomic_id, comic_id).then(function(comic) {

        const embed = new MessageEmbed()
        .setColor('aqua')
        .setTitle(comic.name)
        .setURL(comic.url)
        .setAuthor(comic.info.author, null, comic.info.authorUrl)
        .setImage(comic.imageUrl);

        if(comic.bonusUrl != '') {
            embed.addField('Bonus url', comic.bonusUrl);
        }

        return embed;
    });
}

function GetWebcomic(webcomic_id) {
    for(let i = 0; i < ComicList.length; i++) {
        if(ComicList[i].getInfo().id == webcomic_id) {
            return ComicList[i];
        }
    }
}

async function RegisterComics() {
    const comicInfos = await GetComicInfoAll();

    ComicList.forEach(function(comic) {
        const id = comic.getInfo().id;
        if(!comicInfos.some(function(e) {
            return id === e.comic_id;
        })) {
            // Add comic info
            AddComicInfo(id);
        }
    });
}

const ComicList = [
    ChannelateComic,
    CyanideComic,
    ExoComic,
    SMBCComic,
    SwordsComic,
    WhiteNoiseComic,
    WildelifeComic,
    XKCDComic,
];

module.exports = {
    GetComic,
    GetComicEmbed,
    GetWebcomic,
    RegisterComics,
    ComicList,
};