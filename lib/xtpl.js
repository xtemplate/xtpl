/**
 * @ignore
 * load tpl from file in nodejs
 * @author yiminghe@gmail.com
 */

var fs = require('fs');
var Path = require('path');
var iconv, XTemplate;
var env = process.env.NODE_ENV || 'development';
try {
    iconv = require('iconv-lite');
} catch (e) {
}
try {
    XTemplate = require('xtemplate');
} catch (e) {
    console.error('xtpl depends on xtemplate, please install xtemplate first');
}
var globalConfig = {
    cache: env === 'production',
    encoding: 'utf-8',
    XTemplate: XTemplate
};
var fileCache = {};
var instanceCache = {};
var fnCache = {};

function normalizeSlash(path) {
    if (path.indexOf('\\') !== -1) {
        path = path.replace(/\\/g, '/');
    }
    return path;
}

function compile(tpl, path, callback) {
    var fn;
    try {
        fn = globalConfig.XTemplate.compile(tpl, path);
    } catch (e) {
        return callback(e);
    }
    callback(fn);
}

function getTplFn(path, config, callback) {
    var cache = config.cache;
    if (cache && fnCache[path]) {
        return callback(0, fnCache[path]);
    }
    readFile(path, config, function (error, tpl) {
        if (error) {
            callback(error);
        } else {
            compile(tpl, path, function (err, fn) {
                if (err) {
                    callback(err);
                } else {
                    if (cache) {
                        fnCache[path] = fn;
                    }
                    callback(undefined, fn);
                }
            });
        }
    });
}

function getInstance(path, config, callback) {
    var cache = config.cache;
    if (cache && instanceCache[path]) {
        return callback(0, instanceCache[path]);
    }
    getTplFn(path, config, function (error, tpl) {
        if (error) {
            callback(error);
        } else {
            var instance = new globalConfig.XTemplate(tpl, config);
            if (cache) {
                instanceCache[path] = instance;
            }
            callback(undefined, instance);
        }
    });
}

function readFileSync(path) {
    var content, error;
    try {
        content = fs.readFileSync(path);
    } catch (e) {
        error = e;
    }
    return {
        content: content,
        error: error
    };
}

function readFile(path, config, callback) {
    var cache = config.cache;
    var encoding = config.encoding;
    if (cache && fileCache[path]) {
        return callback(null, fileCache[path]);
    }
    var content, error;
    var ret = readFileSync(path);
    content = ret.content;
    error = ret.error;
    if (content) {
        if (Buffer.isEncoding(encoding)) {
            content = content.toString(encoding);
        } else if (iconv) {
            content = iconv.decode(content, encoding);
        } else {
            error = 'encoding: ' + encoding + ', npm install iconv-lite, please!';
        }
        if (!error && cache) {
            fileCache[path] = content;
        }
    }
    callback(error, content);
}


function endsWith(str, suffix) {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind;
}

var loader = {
    load: function (params, callback) {
        var template = params.root;
        var path = params.name;
        var rootConfig = template.config;
        var extName = rootConfig.extName;
        var pathExtName;
        if (endsWith(path, extName)) {
            pathExtName = extName;
        } else {
            pathExtName = Path.extname(path);
            if (!pathExtName) {
                pathExtName = extName;
                path += pathExtName;
            }
        }
        if (pathExtName !== extName) {
            readFile(path, rootConfig, callback);
        } else {
            getTplFn(path, rootConfig, callback);
        }
    }
};

function renderFile(path, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    path = normalizeSlash(path);
    var encoding = options.settings && options.settings['view encoding'];
    var config = {
        name: path,
        loader: loader,
        cache: options.cache
    };
    encoding = config.encoding = encoding || globalConfig.inEncoding || globalConfig.encoding;
    getInstance(path, config, function (error, engine) {
        if (error) {
            callback(error);
        } else {
            // runtime commands
            engine.render(options, {commands: options.commands}, function (e, content) {
                if (e) {
                    callback(e);
                    return;
                }
                var outEncoding = globalConfig.outEncoding || globalConfig.encoding;
                if (Buffer.isEncoding(outEncoding)) {
                    callback(e, content);
                } else {
                    callback(e, iconv.encode(content, outEncoding));
                }
            });
        }
    });
}

function mix(r, s) {
    for (var p in s) {
        r[p] = s[p];
    }
    return r;
}

/**
 * load xtemplate from file on nodejs
 * @singleton
 */
module.exports = {
    config: function (options) {
        if (!options) {
            return globalConfig;
        } else {
            mix(globalConfig, options);
        }
    },

    __express: renderFile,

    renderFile: renderFile,

    clearCache: function (path) {
        delete instanceCache[path];
        delete fileCache[path];
        delete fnCache[path];
    }
};

Object.defineProperties(module.exports, {
    XTemplate: {
        get: function () {
            return globalConfig.XTemplate;
        }
    }
});