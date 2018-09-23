# channelate.py - channelate comic service

# misc imports
import json
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# web imports
import requests
import discord

from config import config
from util import errors

class Channelate:
    api_url = config['api_url'] + "channelate.php?id={0}"
    id = "channelate"
    name = "Channelate"

    def __init__(self):
        pass

    def get_latest_id(self):
        url = self.api_url.replace("{0}", "0")
        r = requests.get(url)

        return r.json()['id']

    def get_comic(self, id):
        url = self.api_url.replace("{0}", str(id))
        r = requests.get(url)
    
        return self.format_embed(r.json())

    def format_embed(self, data):
        embed = discord.Embed()
        embed.title = data['title']
        embed.url = data['link'].replace("http", "https")

        embed.set_author(name="Channelate", url="https://channelate.com")
        embed.set_image(url=data['img'].replace("http", "https"))
        embed.add_field(name="Bonus", value=data['bonus'].replace("http", "https"))

        return embed
        
def get_object():
    return Channelate()