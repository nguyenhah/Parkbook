/**
 * Created by yves on 03/07/15.
 */

var parkcontrol = angular.module("parkbook", []);

parkcontrol.controller("ParkCtrl", function ($scope, $http) {
    var app = this;
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    app.loadPark = function(parkName) {
        $http.get(url + "/views/park2", {name:parkName}).success(function() {
            console.log("loading" + parkName);
        })
    };

    app.loadName = function(parkID) {
        console.log(parkID);
        $http.get("/park" + parkID).success(function(response) {
            console.log("got ID" + parkID);
        });
    };

    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    app.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
            loadParks();
        })
    };


});
