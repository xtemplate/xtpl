var xtpl = require('../../');
var path = require('path');
var xtplKoa = require('../../lib/koa');
var expect = require('expect.js');

function normalizeSlash(path) {
    if (path.indexOf('\\') !== -1) {
        path = path.replace(/\\/g, '/');
    }
    return path;
}

describe('xtpl', function () {
    it('can get XTemplate engine', function () {
        expect(xtpl.XTemplate).not.to.be(undefined);
    });

    it('works on node', function (done) {
        xtpl.renderFile(path.resolve(__dirname, '../fixture/main.xtpl'), {
            y: '<',
            x: '>'
        }, function (err, data) {
            expect(err).to.be(null);
            expect(data).to.be('<&gt;');
            done();
        });
    });

    it('works on node when cached', function (done) {
        var tplPath = normalizeSlash(path.resolve(__dirname, '../fixture/main.xtpl'));
        var count = 0;
        expect(xtpl.getCache(tplPath).instance).not.to.be.ok();
        xtpl.renderFile(tplPath, {
            y: '<',
            x: '>',
            cache: 1
        }, function (err, data) {
            expect(err).to.be(null);
            expect(data).to.be('<&gt;');
            if (++count === 2) {
                done();
            }
        });
        //console.log(xtpl.getCaches());
        expect(xtpl.getCache(tplPath).instance.config.name).to.be(tplPath);
        xtpl.renderFile(tplPath, {
            y: '<',
            x: '>',
            cache: 1
        }, function (err, data) {
            expect(err).to.be(null);
            expect(data).to.be('<&gt;');
            if (++count === 2) {
                done();
            }
        });
    });

    it('works for koa', function (done) {
        var app = xtplKoa(require('koa')(), {
            views: path.resolve(__dirname, '../fixture/')
        });
        app.use(function *() {

            // test for ctx.state
            this.state.name = 'foo';
            this.state.age = 18;

            var html = yield* this.render('main', {
                y: '<',
                x: '>',
                age: 20
            });
            expect(html).to.be('<&gt;foo20');
        });
        app.listen(4001);
        var request = require('request');
        setTimeout(function () {
            request({url: 'http://localhost:4001'}, function (error, response, body) {
                expect(body).to.be('<&gt;foo20');
                done();
            });
        }, 100);
    });
});