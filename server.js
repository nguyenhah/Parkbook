/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var cors = require("cors");

app.use(cors());

var mongoose = require("mongoose");

mongoose.connect('mongodb://cl:cl@ds034878.mongolab.com:34878/contactlist/parklist');

var Park = mongoose.model('Park', {name: String});

var park = new Park({name: "Arbutus"});



 //ADD NEW ITEM TO DATABASE VIA MONGOOSE
park.save(function (err) {
    if (err) {
        console.log("failed");
    } else {
        console.log("saved");
    }
});

app.get("/", function (req, res) {
    Product.find(function (err, products) {
        res.send(products);
    })
});

app.listen(3000);