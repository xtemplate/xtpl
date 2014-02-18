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
app.set("views options", {defaultLayout: false, layout: true});

app.get("/", function(req, res) {
    res.render("index", {title: "xtpl engine!"})
});

app.get("/main", function(req, res) {
    res.render("main/index", {title: "xtpl engine!"})
});

app.listen(3001, function() {
    console.log("xtpl test sever start : 3001")
});
