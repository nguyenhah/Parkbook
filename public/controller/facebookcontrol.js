/**
 * Created by yves on 14/07/15.
 */

var facebookcontrol = angular.module("parkbook");

facebookcontrol.controller("FacebookCtrl", ['$scope','$http','ezfb', function ($scope, $http, ezfb) {

    updateLoginStatus(updateApiMe);

    $scope.login = function () {
        /**
         * Calling FB.login with required permissions specified
         * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
         */
        ezfb.login(function (res) {
            /**
             * no manual $scope.$apply, I got that handled
             */
            if (res.authResponse) {
                updateLoginStatus(updateApiMe);
                location.reload();
            }
        }, {scope: 'email,user_likes'});

    };

    $scope.logout = function () {
        /**
         * Calling FB.logout
         * https://developers.facebook.com/docs/reference/javascript/FB.logout
         */
        ezfb.logout(function () {
            updateLoginStatus(updateApiMe);
        });
        alert("You have successfully logged out of Facebook");
        location.reload();
    };

    $scope.share = function () {
        ezfb.ui(
            {
                method: 'feed',
                name: 'ParkBook, better than Park Place',
                picture: 'http://plnkr.co/img/plunker.png',
                link: 'https://parkbook.herokuapp.com',
                description: 'Parkbook is great to look at parks from vancouver' +
                ' Please try it and feel free to give feedbacks.'
            },
            function (res) {
                // res: FB.ui response
            }
        );
    };
    /**
     * For generating better looking JSON results
     */
    var autoToJSON = ['loginStatus', 'apiMe'];
    angular.forEach(autoToJSON, function (varName) {
        $scope.$watch(varName, function (val) {
            $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
        }, true);
    });

    /**
     * Update loginStatus result
     */
    function updateLoginStatus(more) {
        ezfb.getLoginStatus(function (res) {
            $scope.loginStatus = res;

            (more || angular.noop)();
        });
    }

    /**
     * Update api('/me') result
     */
    function updateApiMe() {
        ezfb.api('/me', function (res) {
            $scope.apiMe = res;
        });
    }
}]);