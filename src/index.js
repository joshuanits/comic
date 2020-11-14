const config = require('../config.json');

const Database = require('../src/database');

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const { GetComic, GetComicEmbed, ComicList, RegisterComics } = require('../src/comics/comics');
const { GetComicInfo, GetGuildInfo, GetGuildInfoAll, AddGuildInfo, ModifyComicInfo, GetGuildsSubscribedTo } = require('../src/database');

Database.ConnectDatabse(config.connectUri).then(async function() {
    await client.login(config.token);
    await RegisterComics();
    await CheckNewComics();
});

const client = new CommandoClient({
    commandPrefix: config.commandPrefix,
    owner: config.owner,
    invite: config.invite,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['comics', 'Comic commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    CheckNewGuilds();
});

client.on('guildCreate', async function(guild) {
    // Check if we already have info for this guild

    console.log('Joined guild ' + guild.id);
    const guildInfo = await GetGuildInfo(guild.id);

    if(guildInfo === null) {
        AddGuildInfo(guild.id);
    }
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.setInterval(CheckNewComics, 5 * 60 * 1000);

async function CheckNewComics() {
    for(const comic of ComicList) {
        const id = comic.getInfo().id;
        const latestComic = await GetComic(id, 'latest');
        const comicInfo = await GetComicInfo(id);

        if(latestComic.id === comicInfo.latest_id) {
            continue;
        }

        const res = await ModifyComicInfo(id, { latest_id: latestComic.id });

        if(res.ok !== 1) {
            throw(Error('failed to update latest comic'));
        }

        // Get all the guilds which are subscriebd to this comic
        const guilds = await GetGuildsSubscribedTo(id);
        const embed = await GetComicEmbed(id, latestComic.id);

        for(const guild of guilds) {
            if(guild.comic_channel != '') {
                // Send comic
                const channel = await client.channels.fetch(guild.comic_channel);
                channel.send(`New ${comic.getInfo().name} comic!`);
                channel.send(embed);
            }
        }
    }
}

// Checks to see if there are any guilds that don't have a corresponding entry in the guilds collection, and adds any that are missing
async function CheckNewGuilds() {
    const guildInfos = await GetGuildInfoAll();

    client.guilds.cache.forEach(function(guild) {
        if(!guildInfos.some(function(e) {
            return guild.id = e.guild_id;
        })) {
           // Add guild info
           AddGuildInfo(guild.id);
        }
    });
}

// https://discordapp.com/oauth2/authorize?client_id=493303544477253640&scope=bot&permissions=536923136
