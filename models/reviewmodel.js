/**
 * Created by vincentchan on 15-07-02.
 */
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    title: String,
    body: String,
    park: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
    { collection: 'Reviews'});

var reviewModel = mongoose.model('Review', reviewSchema);

function Review(review) {
    this.title = review.title;
    this.body = review.body;
    this.park = review.park;
    this.author = review.author;
}

Review.prototype.save = function() {
    var review = {
        title: this.title,
        body: this.body,
        park: this.park,
        author: this.author
    };
    var newReview = new reviewModel(review);
    newReview.save(function(err) {
        if (err) {
            console.error("Review save failed [reviewmodel.js]");
        }
    });
};