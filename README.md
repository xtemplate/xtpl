xtpl
====

[http://kissyteam.github.io/xtpl/](http://kissyteam.github.io/xtpl/) a template engine based on kissy xtemplate(easier in express).

    app.set("view engine", "xtpl");

and you can specify template file encoding(requires `iconv-lite`):

    app.set("view encoding", "gbk");

## layout

    {{extend ("./layout")}}


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

## test
http://dev.kissyui.com/kissy/src/xtemplate/-/tests/runner

## benchmark
[xtpl jade ejs nunjucks handlebars dust](http://dev.kissyui.com/kissy/src/xtemplate/-/benchmark/)

```
cd benchmark
npm install
node index
node defer
```

## changelog

### 0.17.0

* 支持 map array 类型: https://github.com/kissyteam/kissy/issues/614
* 支持 elseif: https://github.com/kissyteam/kissy/issues/664

### 0.16.0

* 同步读取文件，防止并发打开文件数过多

### 0.12.1

* support different encoding output

### 0.11.0

* bug fix
* tutorial https://github.com/kissyteam/kissy/issues/645

### 0.10.0

* 升级 kissy5.0.0-alpha.3
* xtemplate
  * 支持 include 非 xtpl 文件（不解析）： https://github.com/kissyteam/kissy/issues/646
  * 支持渲染时动态设置命令：https://github.com/kissyteam/kissy/issues/637
  * 支持宏的默认参数值：https://github.com/kissyteam/kissy/issues/647

### 0.9.3

* 优化性能
* 直接使用 kissy5.0.0-alpha.1

### 0.8.0

* 相对于 [kissy 1.4.2 xtemplate](http://docs.kissyui.com/1.4/docs/html/demo/xtemplate/index.html) 语法增强修改：https://github.com/kissyteam/kissy/issues/570
* 支持异步命令：https://github.com/kissyteam/kissy/issues/587
* 修复 {{1}}} 渲染问题：https://github.com/kissyteam/kissy/issues/596
* 支持模型内命令带参数调用：https://github.com/kissyteam/kissy/issues/616
* 支持继承: https://github.com/kissyteam/kissy/issues/564