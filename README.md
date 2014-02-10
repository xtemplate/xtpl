xtpl
====

a template engine based on kissy-xtemplate

## layout

    {{!layout "./layoutname"}}

layout tag must be at the top of template file.


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
