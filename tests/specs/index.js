var xtpl = require('../../');
var path = require('path');
var xtplKoa = require('../../lib/koa');
var expect = require('chai').expect;

describe('xtpl', function () {
    it('can get XTemplate engine', function () {
        expect(xtpl.XTemplate).not.to.equal(undefined);
    });

    it('works on node', function (done) {
        xtpl.renderFile(path.resolve(__dirname, '../fixture/main.xtpl'), {
            y: '<',
            x: '>'
        }, function (err, data) {
            expect(err).to.equal(null);
            expect(data).to.equal('<&gt;');
            done();
        });
    });

    it('works for koa', function (done) {
        var app = xtplKoa(require('koa')(), {
            views: path.resolve(__dirname, '../fixture/')
        });
        app.use(function *() {
            var html = yield* this.render('main', {
                y: '<',
                x: '>'
            });
            expect(html).to.equal('<&gt;');
        });
        app.listen(9000);
        var request = require('request');
        setTimeout(function () {
            request({url: 'http://localhost:9000'}, function (error, response, body) {
                expect(body).to.equal('<&gt;');
                done();
            });
        }, 100);
    });
});