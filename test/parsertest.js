
var assert = require('assert');
var expect = require('chai').expect;

var fs = require('fs'),
    xml2js = require('xml2js');
var filePath = 'data/temp/testdata.xml';
var Parser = require('../parkparser.js');

describe("XMLtoJSON", function() {
        it('this should return us a park in json format', function (done) {
            var testjson = Parser.xmltoJSON(filePath);
                expect(JSON.stringify(testjson)).to.equal(
                    '{"park":{"$":{"ID":"1"},"Name":["Arbutus Village Park"],"Official":["1"]' +
                    ',"StreetNumber":["4202"],"StreetName":["Valley Drive"],"EWStreet":["King Edward Avenue"]' +
                    ',"NSStreet":["Valley Drive"],"GoogleMapDest":["49.249783,-123.155250"],"Hectare":["1.41"]' +
                    ',"Neighbourhood":[{"NeighbourhoodName":["Arbutus Ridge"],"NeighbourhoodURL":' +
                    '["http://vancouver.ca/community_profiles/arbutus_ridge/index.htm"]}],"Advisories":[""],' +
                    '"Facilities":[{"Facility":[{"FacilityCount":["1"],"FacilityType":["Playgrounds"],"FacilityURL":[""]}],"Washroom":[""]}]}}');

            done();
        });
});

describe("GetInfoFromParks to Save", function() {
    it('this should return us a park in json format with parkModel Params', function (done){
    //before(function () {
        var testjson = Parser.xmltoJSON(filePath);
        var jsonstring = Parser.createPark(testjson.park);
        expect(JSON.stringify(jsonstring)).to.equal( '{"name":"Arbutus Village Park","parkID":"1","streetNumber":"4202","streetName":"Valley Drive","lat":49.249783,"lon":-123.15525,"facilityType":["Playgrounds"],"washroomLocation":["No washrooms found"],"features":["No features found"]}');
        done();

    });

    //describe('Park.getPark', function() {
    //    it('should show get parkinfo', function () {
    //        Parser.createPark("Yves's Room",function (err, park) {
    //            expect(err).to.eql(null);
    //            expect(park.name).to.equal("Yves's Room");
    //            expect(park.streetNumber).to.equal("6969");
    //            expect(park.streetName).to.equal('Somewhere Richmond');
    //            done();
    //        });
    //    });
    //});



});