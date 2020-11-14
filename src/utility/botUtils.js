function hasPerms(message) {
    const guildMember = message.guild.member(message.author);
    return guildMember.hasPermission('ADMINISTRATOR');
}

module.exports = {
    hasPerms,
};