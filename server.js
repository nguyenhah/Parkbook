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
    parseData();
    res.send();

});

function parseData() {
    //put this part in a new mapping function
    var fs = require('fs'),
        xml2js = require('xml2js');
    var filePath = 'data/temp/parkdata.xml';

    try {
        var fileData = fs.readFileSync(filePath, 'ascii');

        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            var jsonObject = JSON.stringify(result);

            var parkArray = result.COVParksFacilities.Park;
            for (var i=0; i< parkArray.length; i++){
                var parkName = parkArray[i].Name[0];
                var streetNumber = parkArray[i].StreetNumber[0];
                var streetName = parkArray[i].StreetName[0];
                var destination = parkArray[i].GoogleMapDest[0];
                var res = destination.split(",");
                var lat = res[0];
                var lon = res[1];

                console.log(lat +  ", " + lon);

                var park = new Park({
                    name:parkName,
                    streetNumber:streetNumber,
                    streetName:streetName,
                    lat:parseFloat(lat),
                    lon:parseFloat(lon)
                });

                park.save();

            }

        });
        console.log("File '" + filePath + "/ was successfully read.\n");
    } catch (ex) {
        console.log("Unable to read file '" + filePath + "'.");
        console.log(ex);
    }
}


app.listen(3000);
console.log("App running on port 3000");