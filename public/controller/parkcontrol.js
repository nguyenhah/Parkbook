/**
 * Created by yves on 03/07/15.
 */

var parkcontrol = angular.module("parkbook");

parkcontrol.controller("ParkCtrl", ['$scope','$http','$stateParams','park', function ($scope, $http, $stateParams , park) {
    console.log(park);
    var parkInfo = park.data[0];
    $scope.name = parkInfo.name;
    $scope.address = parkInfo.streetNumber + " " + parkInfo.streetName;

}]);
