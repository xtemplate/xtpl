/**
 * xtpl adapter for koa
 * @author yiminghe@gmail.com
 */
var xtpl = require('./xtpl');
var Path = require('path');

function xtplRender(path, data, option) {
    return function (done) {
        xtpl.render(path, data, option, done);
    };
}

/**
 * merge source to target
 *
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * @api private
 */
function merge(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
}


// option.views
// option.extname
// option.
module.exports = (app, option) => {
    option = option || {};
    var views = option.views;
    var extname = option.extname || 'xtpl';

    var render = (path, data, opt) => {

        var context = {};

        // merge koa ctx.state, notice: koa < 0.14.0 have no ctx.state
        merge(context, this.state || {});
        merge(context, data);

        var filePath;

        if(path.charAt(0) === '/') {
            filePath = path;
        } else {
            filePath = Path.resolve(views, path + '.' + extname);
        }

        let content = '';
        xtplRender(filePath, context, option)((e, data) => {
            content = data;
        });
        return content;
    }

    app.context.render = render;
    return app;
};
