/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", [
    'ui.router',
])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'views/register2.html',
                controller: 'RegCtrl'
            })
            //resolving passes certain variables intomthe controller, which you inject as a dependency to use
            .state('park',{
                //can change parkID to park name after
                url:'/park/:parkName',
                templateUrl:'views/park2.html',
                controller:'ParkCtrl',
                resolve: {
                    park:['$http','$stateParams', function($http, $stateParams){
                        //this is just the get all parks from server RESTFUL API
                        return $http.get('http://localhost:3000/loadpark/' + $stateParams.parkName, {name:$stateParams.parkName}).then(function(response){
                            console.log($stateParams);
                            console.log($stateParams.parkName + " inside app.js");
                            console.log(response + " inside app.js");
                            return response;
                        })
                    }]
                }
            })
    }]);


//We can make this a new JS by specifying it as a directive
// Adding new directive for ngEnter
parkbook.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//This can be refactored as well as it's own controller
parkbook.controller("RegCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    app.registerUser = function(userName, userPassword, userEmail) {
        $http.post(url + "/views/register2", {name:userName, password: userPassword, email: userEmail}).success(function() {
            console.log("registering" + userName);
        })
    };

});