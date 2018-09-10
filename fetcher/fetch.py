import sys
sys.path.append("..") # adds higher directory to python modules path.
import pymongo
import requests
import json
# import webcomic services as a dict
from services import services

from config import config

# connect to mongodb
mongo = pymongo.MongoClient(f"mongodb+srv://{config['mongo_user']}:{config['mongo_pass']}@{config['mongo_host']}/test?retryWrites=true")["comics"]

# loop through all services, checking if there is a new comic
for id, service in services.items():
    id = service.get_latest_id()
    resp = mongo['latest'].find({"comic_id": service.id, "latest_id": id})
    if resp.count() == 0:
        # get comic
        comic = service.get_comic(id).to_dict()
        post_data = {"content": "New comic!", "embeds":[comic]}

        for server in mongo['servers'].find({"subscribed_comics": service.id}):
            requests.post(server['comic_webhook'], headers={"Content-Type": "application/json"}, data=json.dumps(post_data))

        if mongo['latest'].find({"comic_id": service.id}).count() == 0:
            mongo['latest'].insert({"comic_id": service.id, "latest_id": id})
        else:
            mongo['latest'].update({"comic_id": service.id}, {"$set": {"latest_id": id}})