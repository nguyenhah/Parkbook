/**
 * Created by yves on 16/07/15.
 */

var parkcontrol = angular.module("parkbook");
parkcontrol.factory('myService', function($http) {

    var getData = function(parkName) {
        console.log(parkName);

        return $http({method:"GET", url:"/getRating/" + parkName}).then(function(result){
            return result.data;
        });
    };
    return { getData: getData };
});