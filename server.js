/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
var admin = require("./admin");
var Park = require("./models/parkModel");
var parkModel = Park.parkModel;

var User = require("./models/usermodel");
var userModel = User.userModel;

var appRoot = require("app-root-path");

//deployment to heroku
var http = require('http');
//Listen to env port or 3000 and set it in express
var port = Number(process.env.PORT || 3000);
var path = require("path");
app.set('port', port);


var server = http.createServer(app);

app.use(cors());
app.use(bodyParser());
app.use(express.static(__dirname +'/public'));

app.use('/', express.static(appRoot + '/public'));

mongoose.connect('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook');

app.get("/home", function (req, res) {
    parkModel.find(function (err, parks) {
        res.send(parks);
    });
});

app.post("/add", function(req, res) {
    var name = req.body.name;
    console.log(req.body);
    var park = new Park({name:name});

    park.save(function(err) {
        res.send();
    })
});

app.post("/register", function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;

    var user = new User({name:name, password: password, email: email});

    user.save(function(err) {
        res.send()
    })

});


app.get("/download", function(req, res) {
    admin.downloadData();
    admin.clearData();
    admin.parseData();
    res.send();

});

app.post("/search:parkName", function(req, res) {
    var name = req.body.name;
    console.log(req.body.name);
    Park.getPark(name, function(err, park) {
        if (err) return handleError(err);
        console.log(park);
        res.send(park);
    });

});

app.get("/searchall", function(req, res) {
    Park.getAllParks(function (err, parks) {
        if (err) return handleError(err);
        console.log(typeof parks);
    });
    res.send();
});

server.listen(port, function() {
    console.log("Node app is running on port:" + port);
});