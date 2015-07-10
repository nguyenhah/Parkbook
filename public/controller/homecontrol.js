/**
 * Created by yves on 09/07/15.
 */


var homecontrol = angular.module("parkbook");

homecontrol.controller("AppCtrl", ['$scope', '$http', function ($scope, $http) {
    var app = this;
    var url = "http://localhost:3000";
    //var url = "https://parkbook.herokuapp.com";

    app.savePark = function(newPark) {
        $http.post(url + "/add", {name:newPark}).success(function() {
            loadParks();
        })
    };

    // Try HTML5 geolocation
    function checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);

                var infowindow = new google.maps.InfoWindow({
                    map: $scope.mymap,
                    position: pos,
                    content: 'Your Location'
                });

                $scope.mymap.setCenter(pos);


            }, function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }

    function loadParks() {
        $http.get(url + "/home").success(function (parks) {
            app.parks = parks;

            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(49.246292, -123.116226),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.mymap = new google.maps.Map(document.getElementById('map'), mapOptions);

            google.maps.event.addDomListener(window, 'load', loadParks);
            checkLocation();
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

    var prev_infowindow =false;
    var pos;
    var markersArray = [];
    var latitude;
    var longitude;
    function clearOverlays() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }

    //Make Info windows for Maps
    function makeInfoWindow(map, infowindow, marker) {
        return function() {
            if( prev_infowindow ) {
                prev_infowindow.close();
            }
            prev_infowindow = infowindow;
            infowindow.open(map, marker)
        };
    }

    //Make the markers for maps
    function setMarkers(parkObjects) {
        for (var i = 0; i < parkObjects.length; i++) {

            var infowindow = [];
            var marker = [];

            var contentString = '<p><b>' + parkObjects[i].name + '</b></p>' +
                '<p>' + parkObjects[i].streetNumber + " " + parkObjects[i].streetName + '</p>' +
                '<p><a href="#' + parkObjects[i]._id + '">' + "Park profile goes here" +'</a></p>';

            infowindow[i] = new google.maps.InfoWindow({content: contentString});

            marker[i] = new google.maps.Marker({

                map: $scope.mymap,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(parkObjects[i].lat, parkObjects[i].lon),
                title: parkObjects[i].name
            });

            google.maps.event.addListener(marker[i], "click", function () {
                latitude = this.position.lat();
                longitude = this.position.lng();
                //alert(this.position);
                console.log(latitude);
                console.log(longitude);
                console.log(pos);
                calcRoute();
            }); //end addListener

            google.maps.event.addListener(marker[i], 'click', makeInfoWindow($scope.mymap, infowindow[i], marker[i]));
            markersArray.push(marker[i]);
        }
    }

    //Find parks based on the user's search
    app.findPark = function(parkName) {
        clearOverlays();
        console.log(parkName);
        $http.post(url + "/search" + parkName, {name: parkName}).success(function(park) {

            console.log("inside success of findPark");
            app.parksSearched = park;

            setMarkers(park);
            $scope.mymap.panTo(markersArray[0].getPosition());
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

    app.goToPark = function(parkID) {
        console.log("going to park");
        $http.get(url + "/views/park.html", {_id:parkID}).success(function() {
            console.log("inside success of go to park");
        })
    };

}]);