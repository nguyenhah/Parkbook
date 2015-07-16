/**
 * Created by hazai on 15/07/15.
*/


var Park = require('../models/parkModel.js');
var expect = require('chai').expect;
var assert = require("assert");


describe("Park Tests", function() {
    beforeEach(function () {
        var park = new Park({
            name: "Yves's Room",
            streetNumber: "6969",
            streetName: "Somewhere Richmond",
            lat: 69,
            lon: 69,
            facilityType: ["Picnic Sites"],
            washroomLocation: [],
            features: []
        });

        park.save(function(err){});
    });

    describe('Park.getAll', function() {
        it('should get exactly one park', function () {
            Park.getAllParks(function (err, parks) {
                expect(err).to.eql(null);
                expect(parks.length).to.be.equal(2);
                done();
            });
        });
    });

    describe('Park.getRandomPark', function() {
        it('should show that the random park', function () {
            Park.getRandomPark("Yves's Room",function (err, park) {
                expect(err).to.eql(null);
                expect(park.name).to.equal("Yves's Room");
                done();
            });
        });
    });

    describe('Park.getPark', function() {
        it('should show that the searched park', function () {
            Park.getPark("Yves's Room",function (err, park) {
                expect(err).to.eql(null);
                expect(park.name).to.equal("Yves's Room");
                expect(park.streetNumber).to.equal("6969");
                expect(park.streetName).to.equal('Somewhere Richmond');
                done();
            });
        });
    });

});

describe("Park Tests", function() {
    it('test park', function () {
        var park = new Park({
            name: "Yves's Room",
            streetNumber: "6969",
            streetName: "Somewhere Richmond",
            lat: 69,
            lon: 69,
            facilityType: ["Picnic Sites"],
            washroomLocation: [],
            features: []
        });
        expect(park.name).to.be.equal("Yves's Room");
    });
});

//describe('Array', function() {
//    describe('#indexOf()', function () {
//        it('should return -1 when the value is not present', function () {
//            assert.equal(-1, [1,2,3].indexOf(5));
//            assert.equal(-1, [1,2,3].indexOf(0));
//        });
//    });
//});
