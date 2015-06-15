/**
 * Created by hazai on 11/06/15.
 */
var fs = require('fs'),
    xml2js = require('xml2js');
var filePath = 'data/temp/parkdata.xml';
var parser = new xml2js.Parser();
var databaseUrl = "mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook";
var collections = ["parks"];

var mongoose = require('mongoose');
mongoose.connect('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook');

//var mongojs = require("mongojs");
var db = mongojs('mongodb://pb:pb@ds041992.mongolab.com:41992/parkbook', ['parks']);




try {
    var fileData = fs.readFileSync(filePath, 'ascii');

    //var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
        var json = JSON.stringify(result);
        console.log(result);
        db.parks.save(result);
    });

    console.log("File '" + filePath + "/ was successfully read.\n");
} catch (ex) {
    console.log("Unable to read file '" + filePath + "'.");
    console.log(ex);
}