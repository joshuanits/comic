import os
import sys
import json

# load config
config = {}
try:
    f = open(os.path.dirname(os.path.realpath(__file__)) + "/config.json", 'r')
    config = json.load(f)
    f.close()
except Exception as e:
    print("Failed to load config. Run setup.py to create config file, if config file exists ensure it is a valid JSON")
    sys.exit()