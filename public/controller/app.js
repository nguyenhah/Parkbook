/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", [
    'ui.router', 'ezfb'
]);
    parkbook.config(['$urlRouterProvider', '$stateProvider', 'ezfbProvider', function ($urlRouterProvider, $stateProvider, ezfbProvider) {
        $urlRouterProvider.otherwise('/');

        var url = "http://localhost:3000";
        //var url = "https://parkbook.herokuapp.com";


        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    "": {
                        templateUrl: 'views/home.html',
                        controller: 'AppCtrl'
                    },
                    "admin": {
                        templateUrl: 'views/admin.html',
                        controller: 'AdminCtrl',
                        resolve: {
                            admin:
                                ['ezfb', function(ezfb) {
                                     return ezfb.getLoginStatus(function (response) {
                                        if (response.status === 'connected') {
                                            console.log("inside connected");
                                            var uid = response.authResponse.userID;
                                            var accessToken = response.authResponse.accessToken;
                                            console.log(accessToken);

                                            ezfb.api('/me', function(resp) {
                                                console.log(resp);
                                                return resp;
                                            });

                                        } else if (response.status === 'not_authorized') {
                                            // logged in but not authenticaed to app
                                            console.log("inside not authorized");
                                            console.log(response);

                                        } else {
                                            // not logged in
                                            console.log("inside default");
                                        }
                                    });

                                }]
                        }
                    }
                }

            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register2.html',
                controller: 'RegCtrl'
            })
            //resolving passes certain variables into the controller, which you inject as a dependency to use
            .state('park', {
                url: '/park/:parkName',
                views: {
                    "": {
                        templateUrl: 'views/park2.html',
                        controller: 'ParkCtrl',
                        resolve: {
                            park: ['$http', '$stateParams', function ($http, $stateParams) {
                                //get park from server RESTFUL API
                                return $http.get(url + '/loadpark/' + $stateParams.parkName, {name: $stateParams.parkName}).success(function (response) {
                                    console.log($stateParams);
                                    console.log($stateParams.parkName + " inside app.js");
                                    return response;
                                })
                            }]
                        }

                    },
                    "admin": {
                        templateUrl: 'views/admin.html',
                        controller: 'AdminCtrl'
                    }
                }
            });
            //    templateUrl:'views/park2.html',
            //    controller:'ParkCtrl',
            //    resolve: {
            //        park:
            //            ['$http','$stateParams', function($http, $stateParams){
            //            //get park from server RESTFUL API
            //            return $http.get('/loadpark/' + $stateParams.parkName, {name:$stateParams.parkName}).success(function(response){
            //                console.log($stateParams);
            //                console.log($stateParams.parkName + " inside app.js");
            //                return response;
            //            })
            //        }]
            //    }
            //});


        ezfbProvider.setInitParams({
            appId: '485003794998932'
        });
    }]);
