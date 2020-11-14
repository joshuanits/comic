const MongoClient = require('mongodb').MongoClient;

const data = {
    client: undefined,
    db: undefined,
};

function AddGuildInfo(guildId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').insertOne({
        guild_id: parseInt(guildId),
        comic_channel: '',
        subscribed_comics: [],
        prefix: ',',
    });
}

function ClearCollection(name) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection(name).deleteMany();
}

function ConnectDatabse(connectUri, db) {
    if(data.client != undefined) {
        throw(Error('database is already connected'));
    }

    data.client = new MongoClient(connectUri, { useNewUrlParser: true, useUnifiedTopology: true });
    return data.client.connect().then(function() {
        data.db = data.client.db(db);
    }).catch(function(err) {
        console.log('Failed to connect to Mongodb. Error:');
        console.log(err);
    });
}

function GetGuildInfo(guildId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOne({ 'guild_id': parseInt(guildId) });
}

function GetGuildInfoAll() {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').find().toArray();
}

function IsConnected() {
    return data.client.isConnected();
}

function ModifyGuildInfo(guildId, props) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': parseInt(guildId) }, { $set: props });
}

module.exports = {
    AddGuildInfo,
    ClearCollection,
    ConnectDatabse,
    GetGuildInfo,
    GetGuildInfoAll,
    IsConnected,
    ModifyGuildInfo,
};