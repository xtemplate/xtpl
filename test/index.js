/*!
 * # 
 * @author yanmu.wj@taobao.com
 * @date 2014-02-08
 */

/*!*/
var path = require("path");
var app = require("express")();

app.set("view engine", "xtpl");
app.set("view encoding", "gbk");
app.disable("view cache");
// app.enable("view cache");
app.set("views", path.join(__dirname, "views"));

app.get("/", function(req, res) {
    res.render("index", {title: "xtpl engine!"})
});

app.get("/main", function(req, res) {
    res.render("main/index", {title: "xtpl engine!"})
});

app.listen(3001, function() {
    console.log("xtpl test sever start : 3001")
});
