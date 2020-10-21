/* eslint-env mocha */
const expect = require('chai').expect;

const BaseComic = require('../src/comics/base');
const ChannelateComic = require('../src/comics/channelate');

describe('BaseComic', function() {
    describe('#getComicWithId', function() {
        context('with invalid id', function() {
            it('should throw error', async function() {
                try {
                    await BaseComic.getComicWithId(-1);
                    throw(Error('should have failed'));
                } catch (err) {
                    const msg = err.message;
                    expect(msg).equal('comic not found');
                }
            });
        });

        context('with valid id', function() {
            it('should return valid comic', async function() {
                expect((await BaseComic.getComicWithId(1)).id).to.equal(1);
            });
        });
    });

    describe('#getInfo', function() {
        it('should have id base', function() {
            expect(BaseComic.getInfo().id).to.equal('base');
        });
    });
});

describe('ChannelateComic', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                ChannelateComic.getComicWithId('scotch').then(function(comic) {
                    expect(comic.id).to.equal('scotch');
                    expect(comic.name).to.equal('Scotch.');
                    expect(comic.url).to.equal('https://www.channelate.com/comics/scotch');
                    expect(comic.imageUrl).to.equal('https://www.channelate.com/wp-content/uploads/2020/10/2020-10-06-scotch.png');
                    expect(comic.bonusUrl).to.equal('https://www.channelate.com/extra-panel/20201006/');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                ChannelateComic.getComicWithId('latest').then(function(comic) {
                    expect(comic.id).not.equal('');
                    expect(comic.name).not.equal('');
                    expect(comic.url).not.equal('');
                    expect(comic.imageUrl).not.equal('');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });
    });
});