# poorly.py - poorly drawn lines comic service

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

class Poorly:
    api_url = config['api_url'] + "poorly.php?id={0}"
    id = "poorly"
    name = "Poorly Drawn Lines"

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
        embed = discord.Embed()
        embed.title = data['id']
        embed.url = data['link']

        embed.set_author(name="Poorly Drawn Lines", url="http://www.poorlydrawnlines.com/")
        embed.set_image(url=data['img'])

        return embed
        
def get_object():
    return Poorly()