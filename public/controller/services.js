/**
 * Created by yves on 16/07/15.
 */

var parkbook = angular.module("parkbook");

/*
Service to get ratings from rating database
 */
parkbook.factory('myService', function($http) {

    var getData = function(parkName) {
        console.log(parkName);

        return $http({method:"GET", url:"/getRating/" + parkName}).then(function(result){
            return result.data;
        });
    };
    return { getData: getData };
});

/*
Service to get admin status from a user from the admin database
 */
parkbook.factory('authService', function($http) {

    var getData = function(authID) {

        return $http({method:"GET", url:"/auth" + authID}).then(function(result){
            return result.data;
        });
    };
    return { getData: getData };
});