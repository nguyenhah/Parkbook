
var assert = require('assert');

var expect = require('chai').expect;

var fs = require('fs'),
    xml2js = require('xml2js');
var filePath = 'data/temp/testdata.xml';


describe("Parser Tests", function() {
    describe('Park.parser', function() {
        it('this should return us a park in json format', function () {
            var fileData = fs.readFileSync(filePath, 'ascii');
            var parser = new xml2js.Parser();
            parser.parseString(fileData, function (err, result) {
                expect(JSON.stringify(result)).to.equal( '{"park":{"Name":["Arbutus Village Park"]}}');
            });
        });
    });

});