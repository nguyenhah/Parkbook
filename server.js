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

var filePath = 'data/temp/parkdata.xml';
var server = http.createServer(app);


app.use(cors());
app.use(bodyParser());
app.use(express.static(__dirname +'/public'));

app.use('/', express.static(appRoot + '/public'));

mongoose.connect('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook');

/*
Returns an array of all the parks in the park database
 */
app.get("/home", function (req, res) {
    parkModel.find(function (err, parks) {
        res.send(parks);
    });
});

/*
Given a park name, find it in the database and return it
 */
app.get("/loadpark/:parkName", function (req, res) {
    var parkname = req.params.parkName;
    console.log(parkname + " inside server");
    Park.getPark(parkname, function(err, park) {
        if (err) return handleError(err);
        console.log(park);
        res.send(park);
    });
});

/*
Given a park name and a rating for that park, add it to the rating database
 */
app.get("/addRating/:id/:rating/:fbid", function(req, res) {
    console.log(req.params);
    try {
        console.log("in Try");
        var hasRated = true;
        ratingModel.findOne({ID: req.params.id}, function(err, rating) {
            if (rating.users.indexOf(req.params.id) == -1) {
                hasRated = false;
            }
        });

        if (hasRated) {
            res.send(true);
        } else {
            ratingModel.update({ID: req.params.id}, {
                $push: {
                    rating: req.params.rating,
                    users: req.params.fbid
                }
            }, {upsert: true}, function (err, doc) {
                if (err) return res.send(500, {error: err});
                return res.send("succesfully saved");
            });
        }
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

/*
Given an park name, return the rating for that park
 */
app.get("/getRating/:id", function(req, res) {
    var ID = req.params.id;
    console.log(ID);
    Rating.getRating(ID, function(err, rating) {
        if (err) return handleError(err);
        //console.log(rating);
        res.send(rating);
    });
});

/*
Add a new park to the database
 */
app.post("/add", function(req, res) {
    var name = req.body.name;
    console.log(req.body);
    var park = new Park({name:name});

    park.save(function(err) {
        res.send();
    })
});

/*
Register a user to be an admin and save it to admin database
 */
app.post("/views/register2", function(req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var userID = req.body.fbID;

    console.log(req.body.name);
    console.log(req.body.password);
    console.log(req.body.email);
    console.log(req.body.fbID);

    var user = new User({name:name, password: password, email: email, fbID: userID});

    user.save(function(err) {
        res.send()
    })

});

/*
Import park data in XML, convert to json, and load to db
 */
app.get("/download", function(req, res) {
    parkparser.downloadData();
    parkparser.clearData();
    parkparser.parseData(filePath);
    res.send();

});

/*
Search for a park given the park name
 */
app.post("/search:parkName", function(req, res) {
    var name = req.body.name;
    console.log(req.body.name);
    Park.getPark(name, function(err, park) {
        if (err) return handleError(err);
        console.log(park);
        res.send(park);
    });
});


/*
Get all parks
 */
app.post("/adventure", function(req, res) {
    Park.getRandomPark(function (err, park) {
        if (err) return handleError(err);
        res.send(park);
    });
});

/*
Given an authentication ID, return the admin user
 */
app.get("/auth:authID", function(req, res) {
    var auth = req.params.authID;
    userModel.findOne({fbID:auth}, function(err, adminuser) {
        res.send(adminuser);
    });
});

server.listen(port, function() {
    console.log("Node app is running on port:" + port);
});