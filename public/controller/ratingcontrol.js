/**
 * Created by yves on 15/07/15.
 */

var ratingcontrol = angular.module("parkbook");

ratingcontrol.controller("RatingCtrl", ['$http','$scope', function($http, $scope) {
    $scope.rating1 = getAverage();
    $scope.isReadonly = true;
    $scope.rateFunction = function(rating) {
        console.log("Rating selected: " + rating);
    };

    function getAverage() {
        var ra;
        $http.get("/getRating/vincent").success(function(object) {
            //for (var i=0;i < object[0].rating.length;i++){
            //    sum += object[0].rating[i];
            //    console.log(sum);
            //}
            //console.log(sum/2);

            ra = object;

        });
        var sum = 0;
        for (var i=0;i < object[0].rating.length;i++){
            sum += object[0].rating[i];
            console.log(sum);
        }



        console.log("outside of get request: " + sum);

        return sum/2;

    }

    //function getAverage(_callback) {
    //    _callback();
    //}
    //
    //function helperFunction() {
    //    var sum = 0;
    //    getAverage(function() {
    //
    //        $http.get("/getRating/vincent").success(function(object) {
    //            for (var i = 0; i < object[0].rating.length; i++) {
    //                sum += object[0].rating[i];
    //                console.log(sum + "inside request");
    //            }
    //        });
    //        return sum;
    //    });
    //
    //    console.log(sum);
    //    return sum.promise;
    //}

}]);
ratingcontrol.directive("starRating", function() {
        return {
            restrict : "EA",
            template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
            "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
            "    <i class='fa fa-star'></i>" + //&#9733
            "  </li>" +
            "</ul>",
            scope : {
                ratingValue : "=ngModel",
                max : "=?", //optional: default is 5
                onRatingSelected : "&?",
                readonly: "=?"
            },
            link : function(scope, elem, attrs) {
                if (scope.max == undefined) { scope.max = 5; }
                function updateStars() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };
                scope.toggle = function(index) {
                    if (scope.readonly == undefined || scope.readonly == false){
                        scope.ratingValue = index + 1;
                        scope.onRatingSelected({
                            rating: index + 1
                        });
                    }
                };
                scope.$watch("ratingValue", function(oldVal, newVal) {
                    if (newVal) { updateStars(); }
                });
            }
        };
    });