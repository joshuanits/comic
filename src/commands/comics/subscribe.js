const { Command } = require('discord.js-commando');
const { GetWebcomic } = require('../../comics/comics');
const { SubscribeComic } = require('../../database');

module.exports = class SubscribeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'subscribe',
            group: 'comics',
            memberName: 'subscribe',
            description: 'Subscribes to the specified comic.',
            guildOnly: true,
            args: [
                {
                    key: 'webcomic_id',
                    prompt: 'Please type the webcomic you would like to subscribe to. See https://github.com/joshuanits/comic#supported-webcomics for a list of IDs',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { webcomic_id }) {
        const webcomic = GetWebcomic(webcomic_id);
        if(webcomic) {
            const res = await SubscribeComic(message.guild.id, webcomic_id);
            if(res.ok) {
                message.reply(`Subscribed to ${webcomic.getInfo().name}`);
            } else {
                message.reply('Something went wrong.');
            }
        } else {
            message.reply(`Sorry, there is no comic with the id ${webcomic_id}`);
        }
    }
};