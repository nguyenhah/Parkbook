/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());

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



 //ADD NEW ITEM TO DATABASE VIA MONGOOSE
//arbutusPark.save(function (err) {
//    if (err) {
//        console.log("failed");
//    } else {
//        console.log("saved");
//    }
//});

app.get("/", function (req, res) {
    Product.find(function (err, products) {
        res.send(products);
    })
});

app.listen(3000);