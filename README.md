# xtpl

nodejs wrapper around [xtemplate](https://github.com/xtemplate/xtemplate) engine (easier for expressjs and koajs)

[![xtpl](https://nodei.co/npm/xtpl.png)](https://npmjs.org/package/xtpl)
[![NPM downloads](http://img.shields.io/npm/dm/xtpl.svg)](https://npmjs.org/package/xtpl)
[![Build Status](https://secure.travis-ci.org/xtemplate/xtpl.png?branch=master)](https://travis-ci.org/xtemplate/xtpl)
[![Coverage Status](https://coveralls.io/repos/xtemplate/xtpl/badge.png?branch=master)](https://coveralls.io/r/xtemplate/xtpl?branch=master)
[![Dependency Status](https://gemnasium.com/xtemplate/xtpl.png)](https://gemnasium.com/xtemplate/xtpl)

## docs

### syntax

refer: https://github.com/xtemplate/xtemplate

### api

#### methods

##### config or get xtpl global option:
```javascript
Object config(option:Object)
```

option details:
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>encoding</td>
          <td>String</td>
          <td>utf-8</td>
          <td>xtpl file encoding</td>
      </tr>
      <tr>
          <td>XTemplate</td>
          <td>Object</td>
          <td>require('xtemplate')</td>
          <td>xtemplate module value</td>
      </tr>
    </tbody>
</table>

if options is undefined, then this method will return global config.

##### render file
```javascript
void renderFile(path:String, options:Object, callback:function)
```
parameter details:
<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>path</td>
          <td>String</td>
          <td></td>
          <td>xtpl template file</td>
      </tr>
      <tr>
          <td>option</td>
          <td>Object</td>
          <td></td>
          <td>
          data to be rendered. the following properties will be used for control.
          <table class="table table-bordered table-striped">
              <thead>
              <tr>
                  <th style="width: 100px;">name</th>
                  <th style="width: 50px;">type</th>
                  <th style="width: 50px;">default</th>
                  <th>description</th>
              </tr>
              </thead>
              <tbody>
                <tr>
                    <td>cache</td>
                    <td>Boolean</td>
                    <td>false</td>
                    <td>whether cache xtpl by path</td>
                </tr>
                <tr>
                    <td>setting['view encoding']</td>
                    <td>String</td>
                    <td>global encoding</td>
                    <td>encoding for read xtpl files</td>
                </tr>
              </tbody>
          </table>
          </td>
      </tr>
      <tr>
          <td>callback</td>
          <td>function</td>
          <td></td>
          <td>callback</td>
      </tr>
    </tbody>
</table>

```
npm install xtpl xtemplate --save
```

```javascript
var xtpl = require('xtpl');
xtpl.renderFile('./x.xtpl',{
	x:1
},function(error,content){

});
```

##### express adaptor

```javascript
xtpl.__express = xtpl.renderFile
```

##### clear cache

clear xtemplate cache cached by xtpl file path

```javascript
void clearCache(path:String);
```

### use for expressjs

```javascript
var app = require('express')();
app.set('views','./views');
app.set('view engine', 'xtpl');
app.use(function(req, res){
    res.render('test',{data:1});
});
```

### use for koa

```javascript
var app = require('xtpl/lib/koa')(require('koa')(),{
    views:'./views'
});
app.use(function*(){
    yield this.render('test',{data:1});
});
```

## Example

    ├── footer.xtpl
    ├── header.xtpl
    ├── index.xtpl
    ├── layout.xtpl
    ├── layout1.xtpl
    └── sub
        └── header.xtpl

index.xtpl

    {{extend ("./layout1")}}

    {{#block ("head")}}
    <!--index head block-->
    <link type="text/css" href="test.css" rev="stylesheet" rel="stylesheet"  />
    {{/block}}

    {{#block ("body")}}
    <!--index body block-->
    <h2>{{title}}</h2>
    {{/block}}

layout1.xtpl

    <!doctype html>
    <html>
    <head>
    <meta name="charset" content="utf-8" />
    <title>{{title}}</title>
    {{{block ("head")}}}
    </head>
    <body>
    {{{include ("./header")}}}
    {{{block ("body")}}}
    {{{include ("./footer")}}}
    </body>
    </html>


render

    res.render("index", {title: "xtpl engine!"})

output

    <!doctype html>
    <html>
    <head>
    <meta name="charset" content="utf-8" />
    <title>xtpl engine!</title>

    <!--index head block-->
    <link type="text/css" href="test.css" rev="stylesheet" rel="stylesheet"  />

    </head>
    <body>
    <h1>header</h1>
    <h2>sub header</h2>

    <!--index body block-->
    <h2>xtpl engine!</h2>

    <h1>footer</h1>

    </body>
    </html>


## changelog

https://github.com/xtemplate/xtpl/milestones

## License

xtpl is released under the MIT license.