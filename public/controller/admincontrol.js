/**
 * Created by yves on 13/07/15.
 */

var parkbook = angular.module("parkbook");


parkbook.factory('authService', function($http) {

    var getData = function(authID) {

        return $http({method:"GET", url:"/auth" + authID}).then(function(result){
            return result.data;
        });
    };
    return { getData: getData };
});

parkbook.controller("AdminCtrl", ['$http', '$scope','admin', 'authService', function ($http, $scope, admin, authService) {
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    $scope.isAdmin = false;

    authenticate($scope, authService);

    function authenticate($scope, authService) {
        var myDataPromise = authService.getData(admin.authResponse.userID);
        myDataPromise.then(function(result) {
            $scope.data = result;
            if (result.fbID == admin.authResponse.userID) {
                $scope.isAdmin = true;
            }
        });
    }

    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    $scope.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
        })

    };


}]);