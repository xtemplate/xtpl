/**
 * xtpl adapter for koa
 * @author yiminghe@gmail.com
 */
var xtpl = require('./xtpl');
var Path = require('path');

function xtplRender(path, data) {
    return function (done) {
        xtpl.renderFile(path, data, done);
    };
}

// option.views
// option.extname
// option.
module.exports = function (app, option) {
    var views = option.views;
    var extname = option.extname || 'xtpl';

    function *render(path, data, opt) {
        var html = yield xtplRender(Path.resolve(views, path + '.' + extname), data);
        if (!opt || opt.write !== false) {
            this.type = 'html';
            this.body = html;
        }
        return html;
    }

    app.context.render = render;
    return app;
};