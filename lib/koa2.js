/**
 * xtpl adapter for koa
 * @author yiminghe@gmail.com
 */
var xtpl = require('./xtpl');
var Path = require('path');

function xtplRender(path, data, option) {
  return new Promise((resolve, reject) => {
    xtpl.render(path, data, option, (e, data) => {
      if (e) {
        reject(e);
      } else {
        resolve(data);
      }
    });
  });
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

  async function render(path, data, opt) {

    var context = {};

    // merge koa ctx.state, notice: koa < 0.14.0 have no ctx.state
    merge(context, this.state || {});
    merge(context, data);

    var filePath;

    if (path.charAt(0) === '/') {
      filePath = path;
    } else {
      filePath = Path.resolve(views, path + '.' + extname);
    }

    const html = await xtplRender(filePath, context, option);
    if (!opt || opt.write !== false) {
      this.type = 'html';
      this.body = html;
    }
    return html;
  }

  app.context.render = render;
  return app;
};
