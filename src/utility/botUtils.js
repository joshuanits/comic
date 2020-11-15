const { Permissions } = require('discord.js');

function hasPerms(message) {
    const guildMember = message.guild.member(message.author);
    return guildMember.hasPermission(Permissions.FLAGS.ADMINISTRATOR);
}

module.exports = {
    hasPerms,
};