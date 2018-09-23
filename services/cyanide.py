# cyanide.py - cyanide and happiness comic service

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

class Cyanide:
    api_url = config['api_url'] + "cyanide.php?id={0}"
    id = "cyanide"
    name = "Cyanide and Happiness"

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
        embed.title = "Comic " + data['id']
        embed.url = "https://" + data['link']

        embed.set_author(name="Cyanide and Happiness", url="https://explosm.net")
        embed.set_image(url="https:"+data['img'])

        return embed
        
def get_object():
    return Cyanide()