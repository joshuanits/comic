import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
import pymongo
import requests
import json
import traceback
# import webcomic services as a dict
from services import services

from config import config

# connect to mongodb
mongo = pymongo.MongoClient(f"mongodb+srv://{config['mongo_user']}:{config['mongo_pass']}@{config['mongo_host']}/test?retryWrites=true")["comics"]

# loop through all services, checking if there is a new comic
for id, service in services.items():
    try:
        id = service.get_latest_id()
        resp = mongo['latest'].find({"comic_id": service.id, "latest_id": id})
        if resp.count() == 0:
            # get comic
            comic = service.get_comic(id).to_dict()
            post_data = {"content": "New comic!", "embeds":[comic]}

            for guild in mongo['guilds'].find({"subscribed_comics": service.id}):
                requests.post(guild['comic_webhook'], headers={"Content-Type": "application/json"}, data=json.dumps(post_data))

            if mongo['latest'].find({"comic_id": service.id}).count() == 0:
                mongo['latest'].insert({"comic_id": service.id, "latest_id": id})
            else:
                mongo['latest'].update({"comic_id": service.id}, {"$set": {"latest_id": id}})
    except:
        if config['error_webhook'] is not "ERROR_WEBHOOK":
            exc_type, exc_value, exc_traceback = sys.exc_info()
            tb = traceback.format_tb(exc_traceback)

            webhook_content = "```\n"
            for line in tb:
                webhook_content += line
            webhook_content += exc_type.__name__ + " " + str(exc_value) + " when trying to fetch " + service.id + "\n```"
            payload = {"content": webhook_content}

            requests.post(config['error_webhook'], headers={"Content-Type": "application/json"}, data=json.dumps(payload))