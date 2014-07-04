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
hbs.registerPartials(__dirname + '/views/includes', done);
nunjucks.configure(__dirname + '/views/includes');

function done() {
    var data = {
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

    var suite = new Benchmark.Suite();

    suite.add('xtpl', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        // benchmark test function
        'fn': function (deferred) {
            xtpl.renderFile(path.join(__dirname, 'views/includes/common.html'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                // console.log(html);
                deferred.resolve();
            });
        }
    });

    suite.add('jade', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        // benchmark test function
        'fn': function (deferred) {
            jade.renderFile(path.join(__dirname, 'views/includes/common-jade.jade'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        }
    });

    suite.add('ejs', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            ejs.renderFile(path.join(__dirname, 'views/includes/common-ejs.ejs'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        }
    });

    suite.add('dust', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            consolidate.dust(path.join(__dirname, 'views/includes/common-dust.html'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        }
    });

    suite.add('handlebars', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            hbs.__express(path.join(__dirname, 'views/includes/common-handlebars.html'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        }
    });

    suite.add('nunjucks', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            nunjucks.render('common-nunjucks.html', data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        }
    });

    suite.on('cycle', function (event) {
        console.log(String(event.target));
    }).on('complete', function () {
        console.log('all is over')
    }).run({ 'async': true });
}