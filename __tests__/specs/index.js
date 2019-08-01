var xtpl = require('../../');
var path = require('path');
var xtplKoa = require('../../lib/koa2');
var request = require('supertest');
var Koa=require('koa');

function normalizeSlash(path) {
    if (path.indexOf('\\') !== -1) {
        path = path.replace(/\\/g, '/');
    }
    return path;
}

describe('xtpl', function () {
    it('can get XTemplate engine', function () {
        expect(xtpl.XTemplate).not.toBe(undefined);
    });

    it('works on node', function (done) {
        xtpl.renderFile(path.resolve(__dirname, '../fixture/main.xtpl'), {
            y: '<',
            x: '>'
        }, function (err, data) {
            expect(err).toBe(null);
            expect(data).toBe('<&gt;');
            console.log('oooo')
            done();
        });
    });

    it('works on node when cached', function (done) {
        function check(){
            if (++count === 2) {
                console.log('check');
                done();
            }
        }
        var tplPath = normalizeSlash(path.resolve(__dirname, '../fixture/main.xtpl'));
        var count = 0;
        expect(!!xtpl.getCache(tplPath).instance).toBe(false);
        xtpl.renderFile(tplPath, {
            y: '<',
            x: '>',
            cache: 1
        }, function (err, data) {
            expect(err).toBe(null);
            expect(data).toBe('<&gt;');
            check();
        });
        //console.log(xtpl.getCaches());
        expect(xtpl.getCache(tplPath).instance.config.name).toBe(tplPath);
        xtpl.renderFile(tplPath, {
            y: '<',
            x: '>',
            cache: 1
        }, function (err, data) {
            expect(err).toBe(null);
            expect(data).toBe('<&gt;');
            check();
        });
    });

    it('works for koa', function (done) {
        var app = xtplKoa(new Koa(), {
            views: path.resolve(__dirname, '../fixture/')
        });
        app.use(async function (ctx) {

            // test for ctx.state
            ctx.state.name = 'foo';
            ctx.state.age = 18;

            var html = await ctx.render('main', {
                y: '<',
                x: '>',
                age: 20
            });
            expect(html).toBe('<&gt;foo20');
        });

        const server = app.listen();
        request(server)
          .get('/')
          .expect(200)
          .expect('<&gt;foo20', ()=>{
              console.log('oooo')
              server.close();
              done();
          });
    });

    it('works for koa and absolute path', function (done) {
        var app = xtplKoa(new Koa());
        app.use(async function (ctx) {
            ctx.state.name = 'foo';
            ctx.state.age = 18;

            var html = await ctx.render(path.resolve(__dirname, '../fixture/main.xtpl'), {
                y: '<',
                x: '>',
                age: 20
            });
            expect(html).toBe('<&gt;foo20');
        });
        const server = app.listen();
        request(server)
          .get('/')
          .expect(200)
          .expect('<&gt;foo20', ()=>{
              console.log('oooo')
              server.close();
              done();
          });

    });
});
