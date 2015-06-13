/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", []);


parkbook.controller("AppCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000";

    app.savePark = function(newPark) {
        $http.post(url + "/add", {name:newPark}).success(function() {
            loadParks();
        })
    };

    function loadParks() {
        $http.get(url).success(function (parks) {
            app.parks = parks;
        })
    }
    loadParks();

    app.importParks = function() {
        console.log("clicked import");
        $http.get(url +  "/download").success(function() {
            console.log("inside success");
        })

    };


});