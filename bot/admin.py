# admin.py - commands for my use

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

# connect to mongo
mongo = pymongo.MongoClient(f"mongodb+srv://{config['mongo_user']}:{config['mongo_pass']}@{config['mongo_host']}/test?retryWrites=true")["comics"]

def is_owner(ctx):
        return ctx.author.id == 240039475860733952

class AdminCog:
    def __init__(self, bot):
        self.bot = bot

    async def on_ready(self):
        print("Admin cog loaded successfuly")

    #*******************************
    # Details command
    #
    #*******************************

    @commands.command(name="details", hidden = True)
    @commands.check(is_owner)
    @commands.guild_only()
    async def details(self, ctx):
        embed = discord.Embed(title=f"Bot details", color=0x53C1DE)
        embed.add_field(name="Servers", value=f"Count: {len(self.bot.guilds)}")
        await ctx.channel.send(embed=embed)
    
    #********************************
    # Eval command - dangerous !
    #
    #********************************
    @commands.command(name="eval", hidden = True)
    @commands.check(is_owner)
    async def eval(self, ctx, arg):
        await ctx.channel.send("```" + str(eval(arg)) + "```")


def setup(bot):
    bot.add_cog(AdminCog(bot))