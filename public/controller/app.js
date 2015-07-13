/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", [
    'ui.router', 'ezfb'
]);
    parkbook.config(['$urlRouterProvider', '$stateProvider', 'ezfbProvider', function ($urlRouterProvider, $stateProvider, ezfbProvider) {
        $urlRouterProvider.otherwise('/');

        //var url = "http:localhost:3000";
        var url = "https://parkbook.herokuapp.com";


        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'AppCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register2.html',
                controller: 'RegCtrl'
            })
            //resolving passes certain variables into the controller, which you inject as a dependency to use
            .state('park',{
                url:'/park/:parkName',
                templateUrl:'views/park2.html',
                controller:'ParkCtrl',
                resolve: {
                    park:
                        ['$http','$stateParams', function($http, $stateParams){
                        //get park from server RESTFUL API
                        return $http.get(url + '/loadpark/' + $stateParams.parkName, {name:$stateParams.parkName}).success(function(response){
                            console.log($stateParams);
                            console.log($stateParams.parkName + " inside app.js");
                            return response;
                        })
                    }]
                }
            });

        ezfbProvider.setInitParams({
            appId: '485003794998932'
        });
    }]);
