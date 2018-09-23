import discord
from discord.ext import commands

class UnknownWebcomic(commands.CommandError):
    def __init__(self, webcomic_id, *args, **kwargs):
        self.webcomic_id = webcomic_id
        super().__init__(*args, **kwargs)

class ComicNotFound(commands.CommandError):
    def __init__(self, webcomic_id, comic_id, *args, **kwargs):
        self.webcomic_id = webcomic_id
        self.comic_id = comic_id
        super().__init__(*args, **kwargs)