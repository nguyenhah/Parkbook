/**
 * Created by yves on 13/07/15.
 */

var parkbook = angular.module("parkbook");

parkbook.controller("AdminCtrl", ['$http', '$scope', function ($http, $scope) {
    //var url = "http://localhost:3000";
    var url = "https://parkbook.herokuapp.com";

    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    $scope.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
            //loadParks();
        })

    };


}]);