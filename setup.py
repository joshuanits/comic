import json

# Simple script that generates config file
config = {}
config['api_url'] = "localhost"
config['bot_token'] = "BOT_TOKEN"
config['discord_bots_token'] = "TOKEN"
config['error_webhook'] = "ERROR_WEBHOOK"
config['mongo_host'] = "MONGO_HOST"
config['mongo_user'] = "MONGO_USER"
config['mongo_pass'] = "MONGO_PASS"
config['tumblr_key'] = "TUBMLR_KEY"

f = open('config.json', 'w')
f.write(json.dumps(config, indent = 2))
f.close