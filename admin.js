/**
 * Created by vincentchan on 15-06-11.
 */

var JSFtp = require("jsftp");
var appRoot = require("app-root-path");
var Park = require('./models/parkModel');
var parkModel = Park.parkModel;


var ftp = new JSFtp( {
    host: "webftp.vancouver.ca",
    port: 21,
    user: "anonymous",
    pass: "anonymous"

});

var filename = 'parkdata.xml';
var localpath = appRoot + '/data/temp/' + filename;


function downloadData() {
    ftp.get('opendata/xml/parks_facilities.xml', localpath, function(err) {
        if (err) {
            console.error('LOG: There was an error downloading the file [admin.js: ftp.get()]');
        } else {
            console.log('File copied successfully');
        }

    });
}

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
            var count = 0;

            var parkArray = result.COVParksFacilities.Park;
            for (var i=0; i< parkArray.length; i++){
                var parkName = parkArray[i].Name[0];
                var streetNumber = parkArray[i].StreetNumber[0];
                var streetName = parkArray[i].StreetName[0];
                var destination = parkArray[i].GoogleMapDest[0];
                var res = destination.split(",");
                var lat = res[0];
                var lon = res[1];


                var park = new Park({
                    name:parkName,
                    streetNumber:streetNumber,
                    streetName:streetName,
                    lat:parseFloat(lat),
                    lon:parseFloat(lon)
                });

                park.save();
                count++;

            }
            console.log("Added " + count + " parks");

        });
        console.log("File '" + filePath + "/ was successfully read.\n");
    } catch (ex) {
        console.log("Unable to read file '" + filePath + "'.");
        console.log(ex);
    }
}

module.exports = {
    downloadData : downloadData,
    parseData : parseData
};