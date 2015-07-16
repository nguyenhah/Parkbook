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

Rating.addRating = function(name,rate, callback) {
    var userRating = Rating.find(name);
    try {
        if (userRating ){};
    } catch(err){}
};



module.exports = Rating;
module.exports.ratingModel = ratingModel;
