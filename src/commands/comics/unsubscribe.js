const { Command } = require('discord.js-commando');
const { GetWebcomic } = require('../../comics/comics');
const { UnsubscribeComic } = require('../../database');

module.exports = class UnsubscribeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unsubscribe',
            group: 'comics',
            memberName: 'unsubscribe',
            description: 'Unsubscribes from the specified comic.',
            guildOnly: true,
            args: [
                {
                    key: 'webcomic_id',
                    prompt: 'Please type the webcomic you would like to unsubscribe from. See https://github.com/joshuanits/comic#supported-webcomics for a list of IDs',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { webcomic_id }) {
        const webcomic = GetWebcomic(webcomic_id);
        if(webcomic) {
            const res = await UnsubscribeComic(message.guild.id, webcomic_id);
            if(res.ok) {
                message.reply(`Unsubscribed from ${webcomic.getInfo().name}`);
            } else {
                message.reply('Something went wrong.');
            }
        } else {
            message.reply(`Sorry, there is no comic with the id ${webcomic_id}`);
        }
    }
};