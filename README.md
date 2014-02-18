xtpl
====

a template engine based on kissy-xtemplate(easier in express).

    app.set("view engine", "xtpl");

## layout

    {{!layout "./layoutname"}}

layout tag must be at the top of template file. (default layout: "./layout").

And you can set `views options` to specify layout config.

    app.set("views options", {"defaultLayout": false, "layout": true});


## Example

    ├── footer.xtpl
    ├── header.xtpl
    ├── index.xtpl
    ├── layout.xtpl
    ├── layout1.xtpl
    └── sub
        └── header.xtpl

index.xtpl

    {{!layout "./layout1"}}
    {{title}}

layout1.xtpl
    
    <!doctype html>
    <html>
    <head>
    <meta name="charset" content="utf-8" />
    <title>{{title}}</title>
    </head>
    <body>
    {{{include "./header"}}}
    {{{block}}}
    {{{include "./footer"}}}
    </body>
    </html>
