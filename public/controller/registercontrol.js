/**
 * Created by vincentchan on 15-07-02.
 */
var parkbook = angular.module("parkbook");

parkbook.controller("RegCtrl", ['$http', '$scope', function ($http, $scope) {
    //var url = "http://localhost:3000";
    var url = "https://parkbook.herokuapp.com";

    $scope.registerUser = function(userName, userPassword, userEmail) {
        $http.post(url + "/views/register2", {name:userName, password: userPassword, email: userEmail}).success(function() {
            console.log("registering" + userName);
        })
    };


    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    $scope.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
            loadParks();
        })

    };


}]);