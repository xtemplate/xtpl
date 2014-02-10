/*!
 * # xtpl
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var fs = require("fs");
var path = require("path");
var S = require("kissy");

exports.cache = {};

/**
 * layout
 *
 * @param str {String} template content
 * @param path {String} template path
 * @return
 */
exports.layout = function(str, tplPath) {
    /**
     * {{!layout layoutname}}
     */
    var regexp = /^\{\{!layout ['"]([^'"}]+)['"]\}\}[\s\S]*$/;
    var dirname = path.dirname(tplPath),
        layout = regexp.test(str) ? str.replace(regexp, "$1") : "layout";

    str = str.replace(/^\{\{!layout ['"]([^'"}]+)['"]\}\}/, "");

    /**
     * {{!block}}
     */
    if (layout) {
        layout = fs.readFileSync(path.join(dirname, layout + ".xtpl"), {encoding: "utf-8"});
        str = layout.replace(/\{\{!block\}\}/g, str);
    }

    return str;
};

exports.include = function(str, tplPath) {
    var dirname = path.dirname(tplPath);
    return str.replace(/\{\{!include ['"]([^'"}]+)['"]\}\}/g, function($0, $1) {
        return fs.readFileSync(path.join(dirname, $1 + ".xtpl"), {encoding: "utf-8"});
    });
};

exports.read = function(path) {
    var str = "";

    str = fs.readFileSync(path, {encoding: "utf-8"});
    str = exports.layout(str, path);
    str = exports.include(str, path);

    return str;
};

exports.renderFile = function(path, options, fn) {
    // support callback API
    if ("function" == typeof options) {
        fn = options;
        options = {};
    }

    var key = path + ':string';

    options.filename = path;

    var str,
        layout;

    if (options.cache) {
        if (exports.cache[key]) {
            str = exports.cache[key];
        }
        else {

            str = exports.cache[key] = exports.read(path);
        }
    }
    else {
        str = exports.read(path);
    }

    try {
        exports.render(str, options, fn);
    }
    catch (e) {
        fn(e);
    }
};

exports.render = function(str, options, fn){

    options = options || {};

    S.use("xtemplate", function(S, XTemplate) {
        var xtpl = new XTemplate(str, options);
        var ret = xtpl.render(options);
        fn && fn(null, ret);
    });

};

exports.__express = exports.renderFile;
