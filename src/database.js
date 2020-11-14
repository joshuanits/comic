const MongoClient = require('mongodb').MongoClient;

const data = {
    client: undefined,
    db: undefined,
};

function AddComicInfo(comicId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('comics').insertOne({
        comic_id: comicId,
        latest_id: '',
    });
}

function AddGuildInfo(guildId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').insertOne({
        guild_id: guildId,
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

function GetComicInfo(comicId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('comics').findOne({ 'comic_id': comicId });
}

function GetComicInfoAll() {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('comics').find().toArray();
}

function GetGuildInfo(guildId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOne({ 'guild_id': guildId });
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

function ModifyComicInfo(comicId, props) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('comics').findOneAndUpdate({ 'comic_id': comicId }, { $set: props });
}

function ModifyGuildInfo(guildId, props) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $set: props });
}

function SubscribeComic(guildId, comicId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $addToSet: { subscribed_comics: comicId } });
}

function UnsubscribeComic(guildId, comicId) {
    if(data.db == undefined) {
        throw(Error('not connected to database'));
    }

    return data.db.collection('guilds').findOneAndUpdate({ 'guild_id': guildId }, { $pull: { subscribed_comics: comicId } });
}

module.exports = {
    AddComicInfo,
    AddGuildInfo,
    ClearCollection,
    ConnectDatabse,
    GetComicInfo,
    GetComicInfoAll,
    GetGuildInfo,
    GetGuildInfoAll,
    IsConnected,
    ModifyComicInfo,
    ModifyGuildInfo,
    SubscribeComic,
    UnsubscribeComic,
};