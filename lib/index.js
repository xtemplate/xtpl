/*!
 * # xtpl
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var fs = require("fs");
var path = require("path");
var S = require("kissy");

/**
 * screenTpl for layout
 */
var screenTpl;
S.use("xtemplate", function(S, XTemplate) {
    XTemplate.addCommand("block", function(scopes, option) {
        return screenTpl;
    });
});

/**
 * layout
 *
 * @param str {String} template content
 * @param path {String} template path
 * @return
 */
exports.layout = function(tplPath) {
    /**
     * {{!layout layoutname}}
     */
    var regexp = /^\{\{!layout ['"]([^}'"]+)['"]\}\}[\s\S]*$/;
    var str = fs.readFileSync(tplPath, {encoding: "utf-8"}),
        layout = regexp.test(str) ? str.replace(regexp, "$1") : "layout";

    return path.join(path.dirname(tplPath), layout);
};

exports.renderFile = function(tplPath, options, fn) {
    // support callback API
    if ("function" == typeof options) {
        fn = options;
        options = {};
    }

    /**
     * loadFromModuleNanme 依赖包配置路径
     */
    S.config("packages", {
        "views": {
            base: path.dirname(options.settings.views)
        }
    });

    var extname = path.extname(tplPath).slice(1);

    S.use("xtemplate, xtemplate/nodejs", function(S, XTemplate, XTemplateNodeJs) {
        var screenTpl;

        try {
            var moduleName = path.relative(options.settings.views, tplPath);
            var xtpl = XTemplateNodeJs.loadFromModuleName("views/" + moduleName, {
                cache: options.cache,
                cacheFile: options.cache,
                extname: extname
            });

            screenTpl = xtpl.render(options);

            var layoutModuleName = path.relative(options.settings.views, exports.layout(tplPath));
            var tpl = XTemplateNodeJs.loadFromModuleName("views/" + layoutModuleName,
                {
                    cache: options.cache,
                    cacheFile: options.cache,
                    extname: extname,
                    commands: {
                        "block": function(scopes, option) {
                            console.log(option);
                            return screenTpl;
                        }
                    }
                });

            console.log(tpl);
            var ret=tpl.render(options);

            fn && fn(null, ret);
        }
        catch (e) {
            fn && fn(e);
        }
    });
};

exports.__express = exports.renderFile;
