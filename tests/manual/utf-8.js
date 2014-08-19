/*!
 * # 
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var path = require("path");
var app = require("express")();

app.set("view engine", "xtpl");
app.disable("view cache");
// app.enable("view cache");
app.set("views", path.join(__dirname, "views"));

app.get("/", function(req, res) {
    res.charset='utf-8';
    res.contentType('html');
    res.render("utf-8", {title: "xtpl engine!"})
});

app.use(app.router);

app.use(require("express").errorHandler());

app.listen(3002, function() {
    console.log("xtpl test sever start : 3002")
});
