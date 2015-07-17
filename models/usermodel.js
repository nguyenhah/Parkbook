/**
 * Created by vincentchan on 15-06-14.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    flag: String,
    fbID: String,
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
    },
    { collection: 'users' });

var userModel = mongoose.model('User', userSchema);

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.flag = user.flag;
    this.fbID = user.fbID;
    this.reviews = user.reviews;
}

/*
Saves an admin to the admin database
 */
User.prototype.save = function() {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        flag: this.flag,
        fbID: this.fbID,
        reviews: this.reviews
    };
    var newUser = new userModel(user);
    newUser.save(function(err) {
        if (err) {
            console.error("User save failed [usermodel.js]");
        }
    });
};

User.addReview = function(name, review, callback) {
    userModel.findOneAndUpdate(
        { name: name},
        { $push: {reviews: review}},

        function(err, doc) {
        if (err) {
            return callback(err);
        }
        callback(null, doc);
    });
};

module.exports = User;
module.exports.userModel = userModel;