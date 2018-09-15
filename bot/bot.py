# bot.py - Entry point of bot

# misc imports
import json
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

def get_prefix(bot, message):
    prefix = mongo['guilds'].find({'guild_id': str(message.guild.id)}, {'_id': 0, 'prefix': 1}).next()['prefix'] # Get prefix from mongodb

    return commands.when_mentioned_or(prefix)(bot, message)

bot = commands.Bot(command_prefix=get_prefix)

def add_guild(guild_id):
    # Add the guild to the mongo db

    doc = {
        'guild_id': guild_id,
        'comic_channel': "",
        'comic_webhook': "",
        'subscribed_comics': [],
        'prefix': ","
    }

    mongo['guilds'].insert_one(doc)
    print(f"Added guild {guild_id} to mongodb")

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user.name} - {bot.user.id}")
    

    # Check if the bot has joined any guilds since it was last launched
    for guild in bot.guilds:
        # See if guilds collection contains a collection whose guild is the guild id
        guild_id = str(guild.id)
        num = mongo["guilds"].count_documents({"guild_id": guild_id})

        if num == 0:
            add_guild(guild_id)
            
@bot.event
async def on_guild_join(guild):
    guild_id = str(guild.id)
    if mongo['guilds'].count_documents({'guild_id': guild_id}) == 0:
        add_guild(guild_id)

if __name__ == "__main__":
    bot.load_extension("admin")
    bot.load_extension("settings")
    bot.run(config['bot_token'], bot=True)