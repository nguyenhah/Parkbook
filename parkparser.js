/**
 * Created by vincentchan on 15-06-11.
 */

var JSFtp = require("jsftp");
var appRoot = require("app-root-path");
var Park = require('./models/parkModel');
var jf = require('jsonfile');

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
            console.error('LOG: There was an error downloading the file [parkparser.js: ftp.get()]');
        } else {
            console.log('File copied successfully');
        }

    });
}

function clearData() {
    Park.removeAllParks(function(err) {
      if (err) {
        return handleError(err)
      }
    })
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
            var file = 'data/temp/parks.json';

            jf.writeFile(file, result, function(err) {
                console.log(err)
            });

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

                var facilityType= [];
                try {
                    var facility = parkArray[i].Facilities[0].Facility;
                    //Fix the comma at the End
                    for (var j= 0; j<facility.length; j++){
                        facilityType[j] = facility[j].FacilityType[0];
                    }
                    console.log("Trying to add facility");
                }
                catch(err){
                    console.log("no facilities");
                    facilityType = "None";
                }

                var washroomLocation= [];
                try {
                var washroom = parkArray[i].Facilities[0].Washroom;
                    for (var p=0; p<washroom.length; p++) {
                        washroomLocation[p] = washroom[p].Location[0];
                    }
                    console.log("Trying to add washroom");
                }
                catch(err){
                    console.log("no washrooms");
                    washroomLocation[0] = "No washrooms";
                }


                var park = new Park({
                    name:parkName,
                    streetNumber:streetNumber,
                    streetName:streetName,
                    lat:parseFloat(lat),
                    lon:parseFloat(lon),
                    facilityType: facilityType,
                    washroomLocation: washroomLocation
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
    parseData : parseData,
    clearData : clearData
};