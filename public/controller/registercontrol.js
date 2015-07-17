/**
 * Created by vincentchan on 15-07-02.
 */
var parkbook = angular.module("parkbook");

parkbook.controller("RegCtrl", ['$http', '$scope', function ($http, $scope) {

    $scope.registerUser = function(userName, userPassword, userEmail, fbID) {
        $http.post("/views/register2", {name:userName, password: userPassword, email: userEmail, fbID: fbID}).success(function() {
            console.log("registering" + userName);
        })
    };

}]);