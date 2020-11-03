/* eslint-env mocha */
const expect = require('chai').expect;

const BaseComic = require('../src/comics/base');
const ChannelateComic = require('../src/comics/channelate');
const CyanideComic = require('../src/comics/cyanide');
const ExoComic = require('../src/comics/exo');
const SMBCComic = require('../src/comics/smbc');
const SwordsComic = require('../src/comics/swords');
const WildelifeComic = require('../src/comics/wildelife');

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

describe('CyanideComic', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                CyanideComic.getComicWithId('5705').then(function(comic) {
                    expect(comic.id).to.equal('5705');
                    expect(comic.name).to.equal('\n2020.11.02\nby Rob DenBleyker\n');
                    expect(comic.url).to.equal('https://explosm.net/comics/5705');
                    expect(comic.imageUrl).to.contain('//files.explosm.net/comics/Rob/cleanbill.png');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                CyanideComic.getComicWithId('latest').then(function(comic) {
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

describe('ExoComic', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                ExoComic.getComicWithId('635').then(function(comic) {
                    expect(comic.id).to.equal('635');
                    expect(comic.name).to.equal('DAMNIT BUNS YOU HAD ONE JOB');
                    expect(comic.url).to.equal('https://www.exocomics.com/635');
                    expect(comic.imageUrl).to.contain('https://www.exocomics.com/wp-content/uploads/635.jpg');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                ExoComic.getComicWithId('latest').then(function(comic) {
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

describe('SMBCComic', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                SMBCComic.getComicWithId('lingerie').then(function(comic) {
                    expect(comic.id).to.equal('lingerie');
                    expect(comic.name).to.equal('Technically, when nude, we all wear a lingerie of dead skin.');
                    expect(comic.url).to.equal('http://smbc-comics.com/comic/lingerie');
                    expect(comic.imageUrl).to.equal('https://www.smbc-comics.com/comics/1604331563-20201102.png');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                SMBCComic.getComicWithId('latest').then(function(comic) {
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

describe('SwordsComic', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                SwordsComic.getComicWithId('CDLVI').then(function(comic) {
                    expect(comic.id).to.equal('CDLVI');
                    expect(comic.name).to.equal('CDLVI - Halloween Qwesting');
                    expect(comic.url).to.equal('https://swordscomic.com/comic/CDLVI/');
                    expect(comic.imageUrl).to.equal('https://swordscomic.com/media/Swords456T.png');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                SwordsComic.getComicWithId('latest').then(function(comic) {
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

describe('Wildelife', function() {
    this.timeout(5000);
    describe('#getComicWithId', function() {
        context('with valid id', async function() {
            it('should return a comic', function(done) {
                WildelifeComic.getComicWithId('849').then(function(comic) {
                    expect(comic.id).to.equal('849');
                    expect(comic.name).to.equal('challenge accepted');
                    expect(comic.url).to.equal('https://www.wildelifecomic.com/comic/849');
                    expect(comic.imageUrl).to.equal('https://www.wildelifecomic.com/comics/1604033075-849.png');

                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        context('fetching latest', async function() {
            it('shouldn\'t be empty', function(done) {
                WildelifeComic.getComicWithId('latest').then(function(comic) {
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