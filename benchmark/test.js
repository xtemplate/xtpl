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

    new Benchmark('xtpl', {
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
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();

    new Benchmark('jade', {
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
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();

    new Benchmark('ejs', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            ejs.renderFile(path.join(__dirname, 'views/includes/common-ejs.ejs'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();

    new Benchmark('dust', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            consolidate.dust(path.join(__dirname, 'views/includes/common-dust.html'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();

    new Benchmark('handlebars', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            hbs.__express(path.join(__dirname, 'views/includes/common-handlebars.html'), data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();

    new Benchmark('nunjucks', {
        // a flag to indicate the benchmark is deferred
        'defer': true,

        'fn': function (deferred) {
            nunjucks.render('common-nunjucks.html', data, function (err, html) {
                if (err) {
                    throw err;
                }
                deferred.resolve();
            });
        },

        'onComplete': function () {
            console.log(this.toString());
            console.log('');
        },

        'onError': function () {
            console.log(arguments)
        }
    }).run();
}