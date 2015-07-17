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

var fs = require('fs'),
    xml2js = require('xml2js');
var filePath = 'data/temp/parkdata.xml';

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
function getFacility(parkEntry) {
    var facilityType = [];
    try {
        var facility = parkEntry.Facilities[0].Facility;
        for (var j = 0; j < facility.length; j++) {
            facilityType[j] = facility[j].FacilityType[0];
        }
    }
    catch (err) {
        facilityType[0] = "No facilities found";
    }

    return facilityType;

}

function getFeatures(parkEntry) {
    var features = [];
    try {
        var specialFeature = parkEntry.Facilities[0].SpecialFeature;
        for (var j = 0; j < specialFeature.length; j++) {
            features[j] = specialFeature[j];
        }
    }
    catch (err) {
        features[0] = "No features found";
    }

    return features;

}

function getWashroomLocation(parkEntry) {
    var washroomLocation = [];
    try {
        var washroom = parkEntry.Facilities[0].Washroom;
        for (var p = 0; p < washroom.length; p++) {
            washroomLocation[p] = washroom[p].Location[0];
        }
    }
    catch (err) {
        washroomLocation[0] = "No washrooms found";
    }

    return washroomLocation;

}

function writeFileLocal(file, result) {

    try {
        jf.writeFile(file, result);
    }
    catch (err) {
        console.log(err);
    }

    return result;

}

function createPark(parkEntry){
    var parkName = parkEntry.Name[0];
    var parkID = parkEntry.$.ID;
    var streetNumber = parkEntry.StreetNumber[0];
    var streetName = parkEntry.StreetName[0];
    var destination = parkEntry.GoogleMapDest[0];
    var res = destination.split(",");
    var lat = res[0];
    var lon = res[1];

    var facilityType = getFacility(parkEntry);
    var features = getFeatures(parkEntry);
    var washroomLocation = getWashroomLocation(parkEntry);

    var park = new Park({
        name: parkName,
        parkID: parkID,
        streetNumber: streetNumber,
        streetName: streetName,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        facilityType: facilityType,
        washroomLocation: washroomLocation,
        features: features
    });
    return park;
}

function xmltoJSON(path) {
    var jsonresult = "";
    try {
        var fileData = fs.readFileSync(path, 'ascii');

        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result){
            jsonresult = result;
        });
    }
    catch (err) {
        console.log(err);
    }
    return jsonresult;
}

function parseData() {


    try {

        var file = 'data/temp/parks.json';
        var results = xmltoJSON(filePath);

        writeFileLocal(file, results);
        var count = 0;

        var parkArray = results.COVParksFacilities.Park;

            for (var i=0; i< parkArray.length; i++) {
                var parkEntry = parkArray[i];

                var park = createPark(parkEntry);
                park.save();
                count++;

            }
            console.log("Added " + count + " parks");

        console.log("File '" + filePath + "/ was successfully read.\n");
    } catch (ex) {
        console.log("Unable to read file '" + filePath + "'.");
        console.log(ex);
    }
}

module.exports = {
    downloadData : downloadData,
    parseData : parseData,
    createPark : createPark,
    xmltoJSON : xmltoJSON,
    getFacility : getFacility,
    getFeatures: getFeatures,
    getWashroomLocation : getWashroomLocation,
    clearData : clearData
};