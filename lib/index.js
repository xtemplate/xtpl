/*!
 * # xtpl
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var fs = require("fs");
var path = require("path");
var S = require("kissy");

exports.renderFile = function(path, options, fn) {
    // support callback API
    if ("function" == typeof options) {
        fn = options;
        options = undefined;
    }

    if (typeof fn === "function") {
        var res;

        try {
            res = exports.renderFile(path, options);
        }
        catch (e) {
            return fn(e);
        }
    }

    options = options || {};

    var key = path + ':string';

    options.filename = path;

    var str = options.cache
        ? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
        : fs.readFileSync(path, 'utf8');

    return exports.render(str, options, fn);
};

exports.render = function(str, options, fn){

    options = options || {};

    S.use("xtemplate", function(S, XTemplate) {
        var xtpl = new XTemplate(str, options);
        fn(xtpl.render(options));
    });

};

exports.__express = exports.renderFile;
