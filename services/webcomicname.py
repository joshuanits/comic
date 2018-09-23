# webcomicname.py - webcomic name comic service

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

class WebcomicName:
    api_url = config['api_url'] + "webcomicname.php?id={0}"
    id = "webcomicname"
    name = "webcomic name"

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
        embed.url = data['link']

        embed.set_author(name="webcomic name", url="http://webcomicname.com")
        embed.set_image(url=data['img'])

        return embed
        
def get_object():
    return WebcomicName()