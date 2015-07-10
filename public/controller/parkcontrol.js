/**
 * Created by yves on 03/07/15.
 */

var parkcontrol = angular.module("parkbook");

parkcontrol.controller("ParkCtrl", ['$scope','$http','$stateParams','park', function ($scope, $http, $stateParams , park) {
    console.log(park + "inside ParkCtrl");
    $scope.name = park.name;
    $scope.address = park.streetNumber + " " + park.streetName;

}]);
