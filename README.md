# Comic Bot | A Discord webcomic-sending bot
[Invite link](https://discordapp.com/oauth2/authorize?client_id=490328544757678091&scope=bot&permissions=536923136)

[Join the support server](https://discord.gg/FFA9RJE)

At its core, Comic Bot acts as the comic section of a newspaper. You can subscribe to webcomics, and whenever a new webcomic is posted on a subscribed site it will be automatically sent to a specified channel.

## Supported webcomics
* [Channelate](http://channelate.com/) - id: `channelate`
* [Cyanide and Happiness](http://explosm.net/) - id: `cyanide`
* [Garfield](https://garfield.com/) - id: `garfield`
* [Saturday Morning Breakfast Cereal](https://smbc-comics.com) - id: `smbc`
* [webcomic name](http://webcomicname.com/) - id: `webcomicname`
* [xkcd](http://xkcd.com/) - id: `xkcd`
* [Wilde Life](http://wildelifecomic.com/) - id: `wildelife`
* [White Noise](http://www.white-noise-comic.com/) - id: `whitenoise`

## Getting started
Using the bot is simple. By default the bot uses `,` as its prefix. After inviting the bot to your server, set the channel which you want the webcomics sent to using the `settings channel #chan` command. You must tag the channel (the `#chan` must become a link). For instance, if you wanted comics to be sent to a channel called *comics* you would write `,settings channel #chan`. Then simply subscribe to webcomic(s) using the `subscribe id` command. IDs for supported webcomics can be found [here](#supported-webcomics). To unsubscribe from a comic, simply use `unsubscribe id`. 

## Commands
* `comic {webcomic_id} {comic_id}` gets comic `comic_id` from webcomic with id `webcomic_id`.
* `settings` lists all settings for the current server.
* `settings prefix [newprefix]` used to check/set the prefix used to control the bot.
* `settings channel [#newchannel]` used to check/set the channel that webcomics are sent to.
* `subscribe id` used to subscribe to a webcomic. IDs can be found [here](#supported-webcomics).
* `unsubscribe id` used to unsubscribe to a webcomic. IDs can be found [here](#supported-webcomics).

---
Made with love in Australia by ItsDuckyyyy.
