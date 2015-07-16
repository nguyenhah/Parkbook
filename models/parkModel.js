/**
 * Created by vincentchan on 15-06-14.
 */

var mongoose = require('mongoose');

var parkSchema = new mongoose.Schema({
    name: String,
    parkID: String,
    streetNumber: String,
    streetName: String,
    lat: Number,
    lon: Number,
    facilityType: [String],
    washroomLocation: [String],
    features: [String]
},
    {collection: 'parks'});

var parkModel = mongoose.model('Park', parkSchema);

//Constructor
function Park(park){
    this.name = park.name;
    this.parkID = park.parkID;
    this.streetNumber = park.streetNumber;
    this.streetName = park.streetName;
    this.lat = park.lat;
    this.lon = park.lon;
    this.facilityType = park.facilityType;
    this.washroomLocation = park.washroomLocation;
    this.features = park.features
}

Park.prototype.save = function() {
    var park = {
        name: this.name,
        parkID: this.parkID,
        streetNumber: this.streetNumber,
        streetName: this.streetName,
        lat: this.lat,
        lon: this.lon,
        facilityType: this.facilityType,
        washroomLocation: this.washroomLocation,
        features: this.features
    };
    var newPark = new parkModel(park);
    newPark.save(function(err) {
        if (err) {
            console.error("park save failed [parkModel.js]");
        }
    });
};

Park.getPark = function(name, callback) {
    parkModel.find({name: new RegExp('.*'+name+'.*', "i")}, function(err, park) {
        if (err) {
            return callback(err);
        }
        callback(null, park);
    })
};

Park.getAllParks = function(callback) {
    parkModel.find({}, function(err, parks) {
        if (err) {
            return callback(err);
        }
        callback(null, parks);
    })
};

Park.getRandomPark = function(callback) {
    parkModel.find({}, function(err, park) {
        if (err) {
            return callback(err);
        }
        callback(null, park);
    })
};

Park.removeAllParks = function(callback) {
    parkModel.collection.drop(function(err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    })
};


module.exports = Park;
module.exports.parkModel = parkModel;
