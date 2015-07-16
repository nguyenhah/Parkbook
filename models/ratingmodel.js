/**
 * Created by yves on 14/07/15.
 */

/**
 * Created by vincentchan on 15-06-14.
 */

var mongoose = require('mongoose');

var ratingSchema = new mongoose.Schema({
        ID: String,
        rating: [Number],
        numRates: Number
    },
    {collection: 'ratings'});

var ratingModel = mongoose.model('Rating', ratingSchema);

//Constructor
function Rating(rating){
    this.ID = rating.ID;
    this.rating = rating.rating;
    this.numRates = rating.numRates;
}

Rating.prototype.save = function() {
    var rating = {
        ID: this.ID,
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

Rating.getRating = function(ID, callback) {
    ratingModel.find({ID: ID}, function(err, park) {
        if (err) {
            return callback(err);
        }
        callback(null, park);
    })
};

Rating.addRating = function(ID,rate, callback) {
    var userRating = Rating.find(ID);
    try {
        if (userRating ){};
    } catch(err){}
};



module.exports = Rating;
module.exports.ratingModel = ratingModel;
