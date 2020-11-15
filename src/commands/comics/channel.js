const { Command } = require('discord.js-commando');
const { GetGuildInfo, ModifyGuildInfo } = require('../../database');
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

        // https://regexr.com/5g95a
       const channelId = channel.match(/(?:<#)(\d*)(?:>)/i);

       if(channelId == null) {
            message.reply('You must mention a #channel');
            return;
       }

        await ModifyGuildInfo(message.guild.id, { comic_channel: channelId[1] });
        message.channel.send(`Set comic channel to <#${channelId[1]}>`);

    }
};