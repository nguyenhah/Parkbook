
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
        var testjson = Parser.xmltoJSON(filePath);
        var testpark = Parser.createPark(testjson.park);
        expect(JSON.stringify(testpark)).to.equal( '{"name":"Arbutus Village Park","parkID":"1","streetNumber":' +
            '"4202","streetName":"Valley Drive","lat":49.249783,"lon":-123.15525,"facilityType":["Playgrounds"],' +
            '"washroomLocation":["No washrooms found"],"features":["No features found"]}');
        describe("getFacility", function(){
            it('get list of Facility', function (){
                var listoffacility = Parser.getFacility(testpark);
                expect(JSON.stringify(listoffacility)).to.equal('["No facilities found"]');
            });
        });
        describe("getFeatures", function(){
            it('get list of Features', function (){
                var listoffeatures = Parser.getFeatures(testpark);
                expect(JSON.stringify(listoffeatures)).to.equal('["No features found"]');
            });
        });
        describe("getWashroomLocation", function(){
            it('get list of WashroomLocation', function (){
                var listofwashroomlocation = Parser.getWashroomLocation(testpark);
                expect(JSON.stringify(listofwashroomlocation)).to.equal('["No washrooms found"]');
            });
        });
        done();

    });
});