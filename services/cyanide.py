# cyanide.py - cyanide and happiness comic service

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