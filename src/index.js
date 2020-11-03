const config = require('../config.json');

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

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
});

client.on('error', error => {
    console.log(error);
});

client.login(config.token);