/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var admin = require("./admin");


app.use(cors());
app.use(bodyParser());

var mongoose = require("mongoose");

mongoose.connect('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook');

var Park = mongoose.model('Park', {
    name: String,
    streetNumber: String,
    streetName: String,
    lat: Number,
    lon: Number
});


var arbutusPark = new Park({
    name: "Arbutus Village",
    streetNumber: "4202",
    streetName: "Valley Drive",
    lat: 49.249783,
    lon: -123.155250
});


app.get("/", function (req, res) {
    Park.find(function (err, parks) {
        res.send(parks);
    })
});

app.post("/add", function(req, res) {
    var name = req.body.name;
    var park = new Park({name:name});

    park.save(function(err) {
        res.send();
    })
});

app.get("/download", function(req, res) {
    admin.downloadData();
    res.send();
});


app.listen(3000);
console.log("App running on port 3000");