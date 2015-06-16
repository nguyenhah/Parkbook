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

app.use(cors());
app.use(bodyParser());


mongoose.connect('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook');


app.get("/", function (req, res) {
    parkModel.find(function (err, parks) {
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
    admin.clearData();
    admin.parseData();
    res.send();

});

app.get("/search", function(req, res) {
    Park.getPark("Ebisu Park", function(err, park) {
        if (err) return handleError(err);
        console.log(park);
    });
    res.send();
});

app.get("/searchall", function(req, res) {
    Park.getAllParks(function (err, parks) {
        if (err) return handleError(err);
        console.log(typeof parks);
    });
    res.send();
});


app.listen(3000);
console.log("App running on port 3000");