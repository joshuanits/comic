# xkcd.py - xkcd comic service

# misc imports
import json
import os
import sys

# web imports
import requests
import discord

# load config
config = {}

try:
    f = open(os.path.dirname(os.path.realpath(__file__)) + "/../config.json", 'r')
    config = json.load(f)
    f.close()
except:
    print("Failed to load config. Run setup.py to create config file, if config file exists ensure it is a valid JSON")
    sys.exit()

class XKCD:
    api_url = "https://xkcd.com/{0}/info.0.json"
    id = "xkcd"

    def __init__(self):
        pass

    def get_latest_id(self):

        url = "https://xkcd.com/info.0.json"
        r = requests.get(url)

        return str(r.json()['num'])

    def get_comic(self, id):
        url = self.api_url.replace("{0}", str(id))
        r = requests.get(url)
    
        return self.format_embed(r.json())

    def format_embed(self, data):
        embed = discord.Embed()
        embed.title = data['title']
        embed.url = "https://xkcd.com/" + str(data['num'])

        embed.set_author(name="xkcd", url="https://xkcd.com")
        embed.set_image(url=data['img'])

        embed.add_field(name="Alt-text", value=data['alt'])
        return embed
        
def get_object():
    return XKCD()