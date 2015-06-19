/**
 * Created by vincentchan on 15-06-10.
 */
var parkbook = angular.module("parkbook", []);


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

parkbook.controller("AppCtrl", function ($scope, $http) {
    var app = this;
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    app.savePark = function(newPark) {
        $http.post(url + "/add", {name:newPark}).success(function() {
            loadParks();
        })
    };

    function loadParks() {
        $http.get(url + "/home").success(function (parks) {
            app.parks = parks;

            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(49.246292, -123.116226),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.mymap = new google.maps.Map(document.getElementById('map'), mapOptions);
        })
    }
    loadParks();

    //this function is called inside HTML
    //the http call is tagged with "/download" and sent to server.js
    //server.js calls the app.get() with the "/download" tag
    app.importParks = function() {
        console.log("clicked import");
        $http.get(url + "/download").success(function() {
            console.log("inside success");
            loadParks();
        })

    };

    var markersArray = [];

    app.findPark = function(parkName) {
      console.log(parkName);
      $http.post(url + "/search" + parkName, {name: parkName}).success(function(park) {

          console.log("inside success of findPark");
          app.parksSearched = park;

          var text = {
              info: 'test marker info'
          };

          //function clearOverlays() {
          //    for (var i = 0; i < markersArray.length; i++) {
          //        markersArray[i].setMap(null);
          //    }
          //    markersArray.length = 0;
          //}

          //clearOverlays();
          $scope.addMarker = function () {
              for (var i = 0; i < park.length; i++) {
                  $scope.mymarker = new google.maps.Marker({
                      map: $scope.mymap,
                      animation: google.maps.Animation.DROP,
                      position: new google.maps.LatLng(park[i].lat, park[i].lon),
                      title: text.info
                  });
                  //markersArray.push($scope.mymarker);
              }
          };

          console.log(park.length);
      })
    };

    app.findAllParks = function() {
        $http.get(url + "/searchall");
    };



});