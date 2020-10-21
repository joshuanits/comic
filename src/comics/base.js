class BaseComic {
    constructor() {
        this.id = '';
        this.name = '';
        this.url = '';
        this.imageUrl = '';
        this.bonusUrl = '';

        this.setDefaultInfo();
    }

    setDefaultInfo() {
        this.info = {};
        this.info.id = 'base';
        this.info.name = 'Base';
        this.info.author = 'John Doe';
        this.info.authorUrl = 'https://example.com';
    }

    // Returns a promise to a comic
    static getComicWithId(id) {
        // This would usually fetch a comic

        return new Promise(function(resolve, reject) {
            try {
                if(id < 0) {
                    throw Error('comic not found');
                }

                const comic = new BaseComic();
                comic.id = id;
                comic.name = 'Test';
                comic.url = 'https://example.com';
                comic.imageUrl = 'https://picsum.photos/600/400';
                comic.bonusUrl = '';

                resolve(comic);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getInfo() {
        return new BaseComic().info;
    }
}

module.exports = BaseComic;