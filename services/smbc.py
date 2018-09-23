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

class SMBC:
    api_url = config['api_url'] + "smbc.php?id={0}"
    id = "smbc"
    name = "Saturday Morning Breakfast Cereal"

    def __init__(self):
        pass

    def get_latest_id(self):
        url = self.api_url.replace("{0}", "0")
        r = requests.get(url)

        return r.json()['id']

    def get_comic(self, id):
        url = self.api_url.replace("{0}", str(id))
        r = requests.get(url)
    
        data = r.json()

        if data['success'] == 0:
            if data['error'] == "not_found":
                raise(errors.ComicNotFound(self.id, id))

        return self.format_embed(r.json())

    def format_embed(self, data):
        print("dur")
        embed = discord.Embed()
        embed.title = data['title']
        embed.url = data['link'].replace("http", "https")

        embed.set_author(name=self.name, url="https://www.smbc-comics.com")
        embed.set_image(url=data['img'])
        embed.add_field(name="Bonus", value=data['bonus'])
        return embed
        
def get_object():
    return SMBC()