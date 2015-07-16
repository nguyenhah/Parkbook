/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
var parkparser = require("./parkparser");
var Park = require("./models/parkModel");
var parkModel = Park.parkModel;

var Rating = require("./models/ratingmodel");
var ratingModel = Rating.ratingModel;

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

//This is for the dynamic park linking
app.get("/loadpark/:parkName", function (req, res) {
    var parkname = req.params.parkName;
    console.log(parkname + " inside server");
    parkModel.find({name:parkname}, function (err, response) {
        res.send(response);
    });
});


//app.get("/loadpark/:parkName", function(req, res) {
//    var name = req.params.parkName;
//    console.log(req.params.parkName + " inside server");
//    Park.getPark(name, function(err, park) {
//        if (err) return handleError(err);
//        console.log(park);
//        res.send(park);
//    });
//});

//This method needs an object {name:name,rating:[number],numRates:1}
app.get("/addRating/:id/:rating", function(req, res) {
    console.log(req.params);
    try {
        console.log("in Try");
        ratingModel.update({ID: req.params.id}, {$push:{rating: req.params.rating}}, {upsert: true}, function (err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send("succesfully saved");
        });
    } catch (err) {
        console.log("in catch");
        var userRating = new Rating({ID:req.params.id,
            rating:[req.params.rating],
            numRates: 1});
        console.log(userRating);
        userRating.save(function(err) {
            res.send();
        });
    }
});

app.get("/getRating/:id", function(req, res) {
    var ID = req.params.id;
    console.log(ID);
    Rating.getRating(ID, function(err, rating) {
        if (err) return handleError(err);
        //console.log(rating);
        res.send(rating);
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

app.post("/views/register2", function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;

    console.log(req.body.name);
    console.log(req.body.password);
    console.log(req.body.email);

    var user = new User({name:name, password: password, email: email});

    user.save(function(err) {
        res.send()
    })

});

app.get("/download", function(req, res) {
    parkparser.downloadData();
    parkparser.clearData();
    parkparser.parseData();
    res.send();

});

app.get("/views/park2", function(req, res) {
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
        console.log(parks);
    });
    res.send();
});

app.post("/adventure", function(req, res) {
    Park.getRandomPark(function (err, park) {
        if (err) return handleError(err);
        res.send(park);
    });
});

server.listen(port, function() {
    console.log("Node app is running on port:" + port);
});