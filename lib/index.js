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
var screenTpl,
    viewConfigured = false;

/**
 * getLayoutModuleName
 *
 * @param tplPath {String} sub template path
 * @return
 */
function getLayoutModuleName(tplPath) {
    /**
     * {{!layout layoutname}}
     */
    var regexp = /^\{\{!layout ['"]([^}'"]+)['"]\}\}[\s\S]*$/;
    var str = fs.readFileSync(tplPath, {encoding: "utf-8"}),
        layout = regexp.test(str) ? str.replace(regexp, "$1") : "layout";

    return path.join(path.dirname(tplPath), layout);
}

function normalizeSlash(str) {
    return str.replace(/\\/g, "/");
}

S.use("xtemplate, xtemplate/nodejs", {
    success: function(S, XTemplate, XTemplateNodeJs) {
        exports.renderFile = function(tplPath, options, fn) {
            // support callback API
            if ("function" == typeof options) {
                fn = options;
                options = {};
            }

            /**
             * loadFromModuleNanme 依赖包配置路径
             */
            if (!viewConfigured) {
                S.config("packages", {
                    "views": {
                        base: path.dirname(options.settings.views)
                    }
                });
            }

            var extname = path.extname(tplPath).slice(1);

            var screenTpl;

            try {
                var moduleName = path.relative(options.settings.views, tplPath);
                var xtpl = XTemplateNodeJs.loadFromModuleName(
                    "views/" + moduleName, {
                    cache: options.cache,
                    cacheFile: options.cache,
                    extname: extname
                });

                screenTpl = xtpl.render(options);

                var layoutModuleName = normalizeSlash(path.relative(options.settings.views, getLayoutModuleName(tplPath)));
                var ret = XTemplateNodeJs.loadFromModuleName(
                    "views/" + layoutModuleName,
                    {
                        cache: options.cache,
                        cacheFile: options.cache,
                        extname: extname,
                        commands: {
                            "block": function(scopes, option) {
                                return screenTpl;
                            }
                        }
                    })
                    .render(options);

                fn && fn(null, ret);
            }
            catch (e) {
                fn && fn(e);
            }
        };
    },
    sync: true
});

exports.__express = exports.renderFile;
