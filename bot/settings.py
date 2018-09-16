# settings.py - Let's user manage bot settings

# misc imports
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# discord imports
import discord
from discord.ext import commands

# mongodb
import pymongo

# load config
from config import config

# get comic services
from services import services

# connect to mongo
mongo = pymongo.MongoClient(f"mongodb+srv://{config['mongo_user']}:{config['mongo_pass']}@{config['mongo_host']}/test?retryWrites=true")["comics"]

class SettingsCog:
    def __init__(self, bot):
        self.bot = bot

    async def has_perms(ctx):
        user = ctx.author
        channel = ctx.channel
        if user.permissions_in(channel).administrator or user.id == 240039475860733952:
            return True

    async def on_ready(self):
        print("Settings cog loaded successfuly")

    #*******************************
    # subscribe command
    #
    #*******************************
    @commands.command(name='subscribe', help="Used to subscribe to new comics.")
    @commands.check(has_perms)
    @commands.guild_only()
    async def subscribe(self, ctx, comic):
        guild_id = str(ctx.guild.id)

        if comic in services:
            if mongo['guilds'].count_documents({'guild_id': guild_id, 'subscribed_comics': comic}) == 0:
                mongo['guilds'].update({'guild_id': guild_id}, {'$addToSet': {'subscribed_comics': comic}})
                await ctx.send(f"Succesfully subscribed to `{comic}`")
            else:
                await ctx.send(f"Already subscribed to `{comic}`")
        else:
            await ctx.send(f"Comic `{comic}` not found")

    #*******************************
    # unsubscribe command
    #
    #*******************************
    @commands.command(name='unsubscribe', help="Used to unsubscribe from comics.")
    @commands.check(has_perms)
    @commands.guild_only()
    async def unsubscribe(self, ctx, comic):
        guild_id = str(ctx.guild.id)

        if comic in services:
            if mongo['guilds'].count_documents({'guild_id': guild_id, 'subscribed_comics': comic}) == 1:
                mongo['guilds'].update({'guild_id': guild_id}, {'$pull': {'subscribed_comics': comic}})
                await ctx.send(f"Unubscribed from `{comic}`")
            else:
                await ctx.send(f"Already not subscribed to `{comic}`")
        else:
            await ctx.send(f"Comic `{comic}` not found")

    #*******************************
    # settings command
    #
    #*******************************

    @commands.group(name='settings', help="Used to manage settings.")
    @commands.check(has_perms)
    @commands.guild_only()
    async def settings(self, ctx):
        if ctx.invoked_subcommand is None:
            # Get settings from mongodb
            settings = dict(mongo['guilds'].find({'guild_id': str(ctx.guild.id)}, {'_id': 0, 'comic_channel': 1, 'comic_webhook': 0, 'subscribed_comics': 1, 'prefix': 1}).next())

            settingsString = ""

            for k,v in settings.items():
                settingsString += f"{k}: `{v}`\n"

            embed = discord.Embed(title=f"Settings for *{ctx.guild.name}*", color=0x53C1DE)
            embed.add_field(name=u"--------", value=settingsString, inline=False)

            await ctx.channel.send(embed = embed)

    @settings.command(name='prefix', help="Changes bot prefix to `pref`, leave pref blank to list current prefix.")
    async def settings_prefix(self, ctx, pref=None):
        guild_id = str(ctx.guild.id)
        if pref == None:
            # List current prefix
            prefix = mongo['guilds'].find({'guild_id': guild_id}, {'_id': 0, 'prefix': 1}).next()['prefix'] # Get prefix from mongodb
            await ctx.channel.send(f"The current prefix is `{prefix}`")

        else:
            mongo['guilds'].update({'guild_id': guild_id}, {'$set': {'prefix': pref}})
            await ctx.channel.send(f"Prefix changed to `{pref}`")

def setup(bot):
    bot.add_cog(SettingsCog(bot))