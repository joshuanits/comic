const config = require('../config.json');

const Database = require('../src/database');

const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { GetGuildInfo, GetGuildInfoAll, AddGuildInfo } = require('../src/database');

Database.ConnectDatabse(config.testConnectUri, 'development');
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

client.login(config.token);

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
