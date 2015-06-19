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


            // Try HTML5 geolocation
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    pos = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);

                    var infowindow = new google.maps.InfoWindow({
                        map: $scope.mymap,
                        position: pos,
                        content: 'Location found using HTML5.'
                    });

                    $scope.mymap.setCenter(pos);


                }, function() {
                    handleNoGeolocation(true);
                });
            } else {
                // Browser doesn't support Geolocation
                handleNoGeolocation(false);
            }

            //Direction routing
            //var directionsDisplay = new google.maps.DirectionsRenderer();
            //var directionsService = new google.maps.DirectionsService();
            //
            //directionsDisplay.setMap($scope.mymap);
            //
            //function calcRoute() {
            //    var h2 = new google.maps.LatLng(latitude, longitude);
            //    var request = {
            //        origin:pos,
            //        destination:h2,
            //        travelMode: google.maps.TravelMode.WALKING
            //    };
            //    directionsService.route(request, function(result, status) {
            //        if (status == google.maps.DirectionsStatus.OK) {
            //            directionsDisplay.setDirections(result);
            //        }
            //    });
            //}

        })
    }



    loadParks();

    /*
    Geolocation error handler
     */
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(49.246292, -123.116226),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }




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


    var pos;
    var markersArray = [];
    var mymarker;
    var latitude;
    var longitude;
    function clearOverlays() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }

    app.findPark = function(parkName) {
      clearOverlays();
      console.log(parkName);
      $http.post(url + "/search" + parkName, {name: parkName}).success(function(park) {

          console.log("inside success of findPark");
          app.parksSearched = park;

          var text = {
              info: 'test marker info'
          };

              for (var i = 0; i < park.length; i++) {
                  mymarker = new google.maps.Marker({
                      map: $scope.mymap,
                      animation: google.maps.Animation.DROP,
                      position: new google.maps.LatLng(park[i].lat, park[i].lon),
                      title: text.info
                  });
                  google.maps.event.addListener(mymarker, "click", function (event) {
                       latitude = this.position.lat();
                       longitude = this.position.lng();
                      //alert(this.position);
                      console.log(latitude);
                      console.log(longitude);
                      console.log(pos);
                      calcRoute();
                  }); //end addListener
                  markersArray.push($scope.mymarker);
              }

          console.log(park.length);
      })
    };

    app.findAllParks = function() {
        $http.get(url + "/searchall");
    };

    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();


    function calcRoute() {
        directionsDisplay.setMap($scope.mymap);
        var h2 = new google.maps.LatLng(latitude, longitude);
        console.log(h2);
        var request = {
            origin:pos,
            destination:h2,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });
    }

});