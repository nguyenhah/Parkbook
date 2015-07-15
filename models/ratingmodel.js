/**
 * Created by yves on 14/07/15.
 */

/**
 * Created by vincentchan on 15-06-14.
 */

var mongoose = require('mongoose');

var ratingSchema = new mongoose.Schema({
        name: String,
        rating: [Number],
        numRates: Number
    },
    {collection: 'ratings'});

var ratingModel = mongoose.model('Rating', ratingSchema);

//Constructor
function Rating(rating){
    this.name = rating.name;
    this.rating = rating.rating;
    this.numRates = rating.numRates;
}

Rating.prototype.save = function() {
    var rating = {
        name: this.name,
        rating: this.rating,
        numRates: this.numRates
    };

    var newRating = new ratingModel(rating);
    newRating.save(function(err) {
        if (err) {
            console.error("rating save failed [ratingModel.js]");
        }
    });
};

Rating.getRating = function(name, callback) {
    ratingModel.find({name: name}, function(err, park) {
        if (err) {
            return callback(err);
        }
        callback(null, park);
    })
};

Rating.addRating = function(callback) {
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
