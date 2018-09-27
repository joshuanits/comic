# comic.py - for getting individual comics

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
from services import services
from util import errors

# connect to mongo
mongo = pymongo.MongoClient(f"mongodb+srv://{config['mongo_user']}:{config['mongo_pass']}@{config['mongo_host']}/test?retryWrites=true")["comics"]

class ComicCog:
    def __init__(self, bot):
        self.bot = bot

    async def on_ready(self):
        print("Comic cog loaded successfuly")

    #*******************************
    # Comic command
    #
    #*******************************

    @commands.command(name="comic")
    async def comic(self, ctx, webcomic: str, id):
        if webcomic not in services:
            raise(errors.UnknownWebcomic(webcomic))

        comic = services[webcomic].get_comic(id)
        await ctx.send(embed = comic)
        
    @comic.error
    async def comic_handler(self, ctx, error):
        if isinstance(error, commands.MissingRequiredArgument):
            if error.param.name == 'webcomic':
                await ctx.send("You must specify a webcomic id (a list of supported id's can be found here: <https://github.com/ducky11423/comic#supported-webcomics>).")
            if error.param.name == "id":
                await ctx.send("You must specify a comic id.")
        elif isinstance(error, errors.UnknownWebcomic):
            await ctx.send(f"There is no webcomic with id `{error.webcomic_id}` (a list of supported id's can be found here: <https://github.com/ducky11423/comic#supported-webcomics>).")
        elif isinstance(error, errors.ComicNotFound):
            await ctx.send(f"Could not find comic with id `{error.comic_id}` for `{error.webcomic_id}`.")
        else:
            await ctx.send(f"Something went wrong.")

            if config['error_webhook'] is not "ERROR_WEBHOOK":
                webhook_content = f"```\n{error.message}"
                
                webhook_content += error.__name__ + " when trying to fetch " + service.id + "\n```"
                payload = {"content": webhook_content}

                requests.post(config['error_webhook'], headers={"Content-Type": "application/json"}, data=json.dumps(payload))
            

def setup(bot):
    bot.add_cog(ComicCog(bot))