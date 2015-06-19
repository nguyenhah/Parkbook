/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", []);


parkbook.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    app.savePark = function(newPark) {
        $http.post(url + "/add", {name:newPark}).success(function() {
            loadParks();
        })
    };

    function loadParks() {
        $http.get(url + "/home").success(function (parks) {
            app.parks = parks;
        })
    }
    loadParks();

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

    app.findPark = function(parkName) {
      console.log(parkName);
      $http.post(url + "/search" + parkName, {name: parkName}).success(function(park) {

          console.log("inside success of findPark");
          app.parksSearched = park;
          console.log(park);
      })
    };

    app.findAllParks = function() {
        $http.get(url + "/searchall");
    };


});