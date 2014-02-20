/*!
 * # xtpl
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var fs = require("fs");
var path = require("path");
var S = require("./ks-lib/seed.js");
var XTemplateNodeJs = S.nodeRequire("xtemplate/nodejs");

var packageSet;

function normalizeSlash(str) {
    return str.replace(/\\/g, "/");
}

exports.renderFile = function (tplPath, options, callback) {
    if (!packageSet) {
        packageSet = 1;
        S.config("packages", {
            "views": {
                base: (viewDir = options.settings["views"]),
                ignorePackageNameInUri: 1
            }
        });
    }

    var extname = options.settings["view engine"];
    var moduleName = normalizeSlash(tplPath.substring(viewDir.length + 1).slice(0, -extname.length - 1));

    console.log(tplPath);
    console.log(moduleName);
    console.log(options);

    try {
        callback(null, XTemplateNodeJs.loadFromModuleName("views/" + moduleName, {
            cache: options.cache,
            extname: extname
        }).render(options));
    } catch (e) {
        callback(e);
    }
};

exports.__express = exports.renderFile;
