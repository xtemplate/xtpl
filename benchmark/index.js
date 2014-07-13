/**
 * benchmark between xtpl jade ejs dust handlebars nunjucks
 * @author yiminghe@gmail.com
 */


var Benchmark = require('benchmark');
var xtpl = require('../index');
var path = require('path');
var jade = require('jade');
var ejs = require('ejs');
var dust = require('dustjs-linkedin');
var handlebars = require('handlebars');
var nunjucks = require('nunjucks');
var consolidate = require('consolidate');
var hbs = require('hbs').create(handlebars);
var util = require('kissy/lib/util');

// force synchronous
dust.nextTick = function (callback) {
    callback();
};

hbs.registerPartials(__dirname + '/views/includes', function () {
    doCache(done);
});

nunjucks.configure(__dirname + '/views/includes');
console.log('cache: true');
function getData() {
    return {
        cache: true,
        settings: {
            views: __dirname + '/views/includes'
        },
        title: 'Demo',
        views: path.join(__dirname, 'views'),
        using: true,
        lis: [
            {
                d: 'one'
            },
            {
                d: 'two'
            },
            {
                d: 'three'
            }
        ]
    };
}

function doCache(callback) {
    var now = 0;

    function ok(err) {
        if(err){
            console.log(err);throw err;
        }
        ++now;
        if (now === 6) {
            callback();
        }
    }

    xtpl.renderFile(path.join(__dirname, 'views/includes/xtpl.html'), getData(), ok);
    jade.renderFile(path.join(__dirname, 'views/includes/jade.jade'), getData(), ok);
    ejs.renderFile(path.join(__dirname, 'views/includes/ejs.ejs'), getData(), ok);
    consolidate.dust(path.join(__dirname, 'views/includes/dust.html'), getData(), ok);
    consolidate.handlebars(path.join(__dirname, 'views/includes/handlebars.html'), getData(), ok);
    nunjucks.render('nunjucks.html', getData(), ok);
}

function done() {
    var suite = new Benchmark.Suite();

    suite.add('xtpl', {
        // benchmark test function
        'fn': function () {
            var content;
            xtpl.renderFile(path.join(__dirname, 'views/includes/xtpl.html'), getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('xtpl sync error');
            }
        }
    });

    suite.add('jade', {
        // benchmark test function
        'fn': function () {
            var content;
            jade.renderFile(path.join(__dirname, 'views/includes/jade.jade'), getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('jade sync error');
            }
        }
    });

    suite.add('ejs', {
        'fn': function () {
            var content;
            ejs.renderFile(path.join(__dirname, 'views/includes/ejs.ejs'), getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('ejs sync error');
            }
        }
    });

    suite.add('dust', {
        'fn': function () {
            var content;
            consolidate.dust(path.join(__dirname, 'views/includes/dust.html'), getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('dust sync error');
            }
        }
    });

    suite.add('handlebars', {
        'fn': function () {
            var content;
            consolidate.handlebars(path.join(__dirname, 'views/includes/handlebars.html'), getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('handlebars sync error');
            }
        }
    });

    suite.add('nunjucks', {
        'fn': function () {
            var content;
            nunjucks.render('nunjucks.html', getData(), function (err, html) {
                if (err) {
                    console.log(err);throw err;
                }
                content = html;
            });
            if (!content) {
                throw new Error('nunjucks sync error');
            }
        }
    });

    suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).on('complete', function () {
        console.log('all is over');
    }).run({ 'async': true });
}