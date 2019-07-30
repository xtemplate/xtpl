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
  XTemplate = XTemplate.default || XTemplate;
} catch (e) {
  console.error('xtpl depends on xtemplate, please install xtemplate xtpl both');
}
var globalConfig = {
  cache: env === 'production',
  catchError: env !== 'production',
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

function compile(root, tpl, path, callback) {
  var fn;
  try {
    fn = root.compile(tpl, path);
  } catch (e) {
    return callback(e);
  }
  callback(null, fn);
}

function getTplFn(root, path, config, callback) {
  var cache = config.cache;
  if (cache && fnCache[path]) {
    return callback(0, fnCache[path]);
  }
  readFile(path, config, function (error, tpl) {
    if (error) {
      callback(error);
    } else {
      compile(root, tpl, path, function (err, fn) {
        if (err) {
          callback(err);
        } else {
          if (cache) {
            fnCache[path] = fn;
          }
          callback(null, fn);
        }
      });
    }
  });
}

function getInstance(config) {
  var cache = config.cache;
  var path = config.name;
  var cached;
  if (cache && (cached = instanceCache[path])) {
    return cached;
  }
  var instance = new globalConfig.XTemplate(config);
  if (cache) {
    instanceCache[path] = instance;
  }
  return instance;
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
  var cached;
  if (cache && (cached = fileCache[path])) {
    return callback(null, cached);
  }
  var encoding = config.encoding;
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
  load: function (tpl, callback) {
    var template = tpl.root;
    var path = tpl.name;
    var rootConfig = template.config;
    var extname = rootConfig.extname;
    var pathExtName;
    if (endsWith(path, extname)) {
      pathExtName = extname;
    } else {
      pathExtName = Path.extname(path);
      if (!pathExtName) {
        pathExtName = extname;
        path += pathExtName;
      }
    }
    if (pathExtName !== extname) {
      readFile(path, rootConfig, callback);
    } else {
      getTplFn(template, path, rootConfig, callback);
    }
  }
};

function renderFile(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  render(path, options, {
    cache: options.cache,
    commands: options.commands,
    encoding: options.settings && options.settings['view encoding']
  }, callback);
}

function getOption(options, name) {
  return options[name] === undefined ? globalConfig[name] : options[name];
}

function render(path, data, options, callback) {
  options = options || {};

  var extname;
  if (options.extname) {
    extname = options.extname.charAt(0) === '.' ?
      options.extname :
      '.' + options.extname;
  } else {
    extname = Path.extname(path);
  }

  path = normalizeSlash(path);
  var engine = getInstance({
    name: path,
    extname: extname,
    loader: loader,
    strict: getOption(options, 'strict'),
    catchError: getOption(options, 'catchError'),
    cache: getOption(options, 'cache'),
    encoding: getOption(options, 'encoding')
  });
  // runtime commands
  engine.render(data, { commands: options.commands }, function (e, content) {
    if (e) {
      callback(e);
      return;
    }
    callback(e, content);
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

  render: render,

  renderFile: renderFile,

  getCaches: function () {
    return {
      instance: instanceCache,
      file: fileCache,
      fn: fnCache
    };
  },

  getCache: function (path) {
    return {
      instance: instanceCache[path],
      file: fileCache[path],
      fn: fnCache[path]
    };
  },

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
