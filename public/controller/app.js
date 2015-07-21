/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", [
    'ui.router', 'ezfb', 'ui.bootstrap'
]);
    parkbook.config(['$urlRouterProvider', '$stateProvider', 'ezfbProvider', function ($urlRouterProvider, $stateProvider, ezfbProvider) {
        $urlRouterProvider.otherwise('/');

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
                                            console.log("logged in and authorized");
                                            //var uid = response.authResponse.userID;
                                            //var accessToken = response.authResponse.accessToken;


                                        } else if (response.status === 'not_authorized') {
                                            // logged in but not authenticaed to app
                                            console.log("logged in and not authorized");

                                        } else {
                                            // not logged in
                                            console.log("not logged in");
                                        }
                                    });

                                }]
                        }
                    }
                }

            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'RegCtrl'
            })
            //resolving passes certain variables into the controller, which you inject as a dependency to use
            .state('park', {
                url: '/park/:parkName',
                views: {
                    "": {
                        templateUrl: 'views/park.html',
                        controller: 'ParkCtrl',
                        resolve: {
                            park: ['$http', '$stateParams', function ($http, $stateParams) {
                                //get park from server RESTFUL API
                                return $http.get('/loadpark/' + $stateParams.parkName, {name: $stateParams.parkName}).success(function (response) {
                                    return response;
                                })
                            }],
                            admin:
                                ['ezfb', function(ezfb) {
                                    return ezfb.getLoginStatus(function (response) {
                                        if (response.status === 'connected') {
                                            console.log("inside connected");

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

                    },
                    "admin": {
                        templateUrl: 'views/admin.html',
                        controller: 'AdminCtrl',
                        resolve: {
                            admin:
                                ['ezfb', function(ezfb) {
                                    return ezfb.getLoginStatus(function (response) {
                                        if (response.status === 'connected') {
                                            console.log("logged in and authorized");

                                        } else if (response.status === 'not_authorized') {
                                            // logged in but not authenticaed to app
                                            console.log("logged in and not authorized");
                                            console.log(response);

                                        } else {
                                            // not logged in
                                            console.log("not logged in");
                                        }
                                    });

                                }]
                        }
                    }
                }
            });


        ezfbProvider.setInitParams({
            appId: '485003794998932'
        });
    }]);
