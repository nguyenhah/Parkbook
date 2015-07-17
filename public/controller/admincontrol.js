/**
 * Created by yves on 13/07/15.
 */

var parkbook = angular.module("parkbook");


parkbook.controller("AdminCtrl", ['$http', '$scope','admin', 'authService', function ($http, $scope, admin, authService) {

    $scope.isAdmin = false;

    authenticate($scope, authService);

    /*
    Check if the current user is an Admin
     */
    function authenticate($scope, authService) {
        try {
            var myDataPromise = authService.getData(admin.authResponse.userID);
            myDataPromise.then(function (result) {
                $scope.data = result;
                if (result.fbID == admin.authResponse.userID) {
                    $scope.isAdmin = true;
                }
            });
        } catch (err) {
            console.log("user not logged in");
        }
    }

    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    $scope.importParks = function() {
        console.log("clicked import");
        $http.get("/download").success(function() {
            console.log("inside success");
        })

    };


}]);