const config = require('../config.json');
const { CommandoClient } = require('discord.js-commando');

const client = new CommandoClient({
    commandPrefix: config.commandPrefix,
    owner: config.owner,
    invite: config.invite,
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
});

client.login(config.token);