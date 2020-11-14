/* eslint-env mocha */
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const expect = chai.expect;

const config = require('../config.json');
const Database = require('../src/database');

describe('Database testing', function() {
    this.timeout(5000);
    describe('#ConnectDatabase', function() {
        it('should connect successfully', function(done) {
            Database.ConnectDatabse(config.testConnectUri, 'test').then(function() {
                expect(Database.IsConnected()).to.equal(true);
                done();
            });
        });
    });

    describe('#ClearCollection', function() {
        it('should clear the collections', function(done) {
            Database.ClearCollection('comics').then(function(val) {
                expect(val.result.ok, 'clear comics').to.equal(1, 'comics ok');
                return Database.ClearCollection('guilds');
            }).then(function(val) {
                expect(val.result.ok, 'clear guilds').to.equal(1);
                done();
            });
        });
    });

    describe('#GetGuildInfoAll', function() {
        context('after clearing', function() {
            it('should return an empty array', function(done) {
                Database.GetGuildInfoAll().then(function(val) {
                    expect(val.length).to.equal(0);
                    done();
                });
            });
        });
    });

    describe('#AddGuildInfo', function() {
        it('should add guild info', function(done) {
            Database.AddGuildInfo('12345678').then(function(val) {
                expect(val.result.ok).to.equal(1);
                done();
            });
        });
    });

    describe('#GetGuildInfo', function() {
        it('should return a guild info', function(done) {
            Database.GetGuildInfo('12345678').then(function(val) {
                expect(val.guild_id).to.equal(12345678);
                done();
            });
        });
    });

    describe('#ModifyGuildInfo', function() {
        it('should modify guild info', function(done) {
            Database.ModifyGuildInfo('12345678', {
                comic_channel: 'abcde',
                subscribed_comics: ['test'],
                prefix: ',',
            }).then(function(val) {
                expect(val.ok).to.equal(1);
                return Database.GetGuildInfo('12345678');
            }).then(function(val) {
                expect(val).to.containSubset({
                    guild_id: 12345678,
                    comic_channel: 'abcde',
                    subscribed_comics: ['test'],
                    prefix: ',',
                });
                done();
            });
        });
    });

    // comics

    describe('#GetComicInfoAll', function() {
        context('after clearing', function() {
            it('should return an empty array', function(done) {
                Database.GetComicInfoAll().then(function(val) {
                    expect(val.length).to.equal(0);
                    done();
                });
            });
        });
    });

    describe('#AddComicInfo', function() {
        it('should add comic info', function(done) {
            Database.AddComicInfo('testcomic').then(function(val) {
                expect(val.result.ok).to.equal(1);
                done();
            });
        });
    });

    describe('#GetComicInfo', function() {
        it('should return a guild info', function(done) {
            Database.GetComicInfo('testcomic').then(function(val) {
                expect(val.comic_id).to.equal('testcomic');
                done();
            });
        });
    });

    describe('#ModifyComicInfo', function() {
        it('should modify comic info', function(done) {
            Database.ModifyComicInfo('testcomic', {
                latest_id: '123',
            }).then(function(val) {
                expect(val.ok).to.equal(1);
                return Database.GetComicInfo('testcomic');
            }).then(function(val) {
                expect(val).to.containSubset({
                    comic_id: 'testcomic',
                    latest_id: '123',
                });
                done();
            });
        });
    });
});