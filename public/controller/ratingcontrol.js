/**
 * Created by yves on 15/07/15.
 */

//var ratingcontrol = angular.module("parkbook");

//ratingcontrol.factory('myService', function($http) {
//
//    var getData = function() {
//
//        return $http({method:"GET", url:"/getRating/1"}).then(function(result){
//            return result.data;
//        });
//    };
//    return { getData: getData };
//});


//ratingcontrol.controller("RatingCtrl", ['$http','$scope', 'myService', function($http, $scope, myService) {
//    getAverage($scope, myService);
//    $scope.rating1 = 1;
//    $scope.isReadonly = true;
//    $scope.rateFunction = function(rating) {
//        console.log("Rating selected: " + rating);
//    };
//
//
//    function getAverage($scope, myService) {
//        var myDataPromise = myService.getData();
//        myDataPromise.then(function(result) {  // this is only run after $http completes
//            $scope.data = result;
//            var sum = 0;
//            for (var i = 0; i < result[0].rating.length; i++) {
//                sum += result[0].rating[i];
//            }
//            sum = sum / result[0].rating.length;
//            console.log($scope.data[0].rating[0]);
//            $scope.rating1 = sum;
//        });
//    }
//
//
//}]);
//ratingcontrol.directive("starRating", function() {
//        return {
//            restrict : "EA",
//            template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
//            "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
//            "    <i class='fa fa-star'></i>" + //&#9733
//            "  </li>" +
//            "</ul>",
//            scope : {
//                ratingValue : "=ngModel",
//                max : "=?", //optional: default is 5
//                onRatingSelected : "&?",
//                readonly: "=?"
//            },
//            link : function(scope, elem, attrs) {
//                if (scope.max == undefined) { scope.max = 5; }
//                function updateStars() {
//                    scope.stars = [];
//                    for (var i = 0; i < scope.max; i++) {
//                        scope.stars.push({
//                            filled : i < scope.ratingValue
//                        });
//                    }
//                };
//                scope.toggle = function(index) {
//                    if (scope.readonly == undefined || scope.readonly == false){
//                        scope.ratingValue = index + 1;
//                        scope.onRatingSelected({
//                            rating: index + 1
//                        });
//                    }
//                };
//                scope.$watch("ratingValue", function(oldVal, newVal) {
//                    if (newVal) { updateStars(); }
//                });
//            }
//        };
//    });