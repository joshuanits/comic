const { Command } = require('discord.js-commando');
const { GetWebcomic } = require('../../comics/comics');
const { UnsubscribeComic, GetGuildInfo, ModifyGuildInfo } = require('../../database');
const { hasPerms } = require('../../utility/botUtils');

module.exports = class UnsubscribeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'channel',
            group: 'comics',
            memberName: 'channel',
            description: 'Sets the channel that comics are sent to.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: 'Please tag the channel you would like comics to be sent to, or ? to get the current channel',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { channel }) {
        if(!hasPerms(message)) {
            message.reply('Sorry, you don\'t have permission to run that command');
            return;
        }

        if(channel === '?') {
            const guildInfo = await GetGuildInfo(message.guild.id);
            message.channel.send(guildInfo.comic_channel ? `The comic channel is currently <#${guildInfo.comic_channel}>` : 'The comic channel is not currently set.');
            return;
        }

        const mentions = Array.from(message.mentions.channels);

        if(mentions.length === 0) {
            message.reply('You must mention a #channel');
            return;
        }

        await ModifyGuildInfo(message.guild.id, {comic_channel: mentions[0][0] });
        message.channel.send(`Set comic channel to <#${mentions[0][0]}>`);

    }
};