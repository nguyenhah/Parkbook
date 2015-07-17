/**
 * Created by yves on 09/07/15.
 */


var homecontrol = angular.module("parkbook");

homecontrol.controller("AppCtrl", ['$scope', '$http', 'ezfb','limitToFilter', function ($scope, $http, ezfb, limitToFilter) {

    /*
    TypeAhead
     */
    $scope.selected = undefined;

    /*
    Given a park name or part of a park name, search the server for names that match the park name
     */
    $scope.getLocation = function(parkName) {
        return $http.get('/loadpark/' + parkName, {name:parkName}).then(function(response){
            console.log(response.data);
            return limitToFilter(response.data.map(function(item){
                console.log(item.name);
                return (item.name);
            }), 10);
        });
    };

    var originalMapOptions = {
        zoom: 12,
        scrollwheel: false,
        center: new google.maps.LatLng(49.246292, -123.116226),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    homeMap = new google.maps.Map(document.getElementById('map'), originalMapOptions);

    /*
    Check if geolocation is supported by the browser
     */
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


    /*
    Initialize the controller with parks from the database, and check for user location
     */
    function loadParks() {
        $http.get("/home").success(function (parks) {
            $scope.parks = parks;

            $scope.mymap = new google.maps.Map(document.getElementById('map'), originalMapOptions);

            google.maps.event.addDomListener(window, 'load', loadParks);
            checkLocation();
        })
    }

    loadParks();

    /*
     Geolocation error handler
     Called when browser does not support geolocation
     */
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: mymap,
            position: new google.maps.LatLng(49.246292, -123.116226),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }


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

    /*
    Make infowindows for each marker on the map
     */
    function makeInfoWindow(map, infowindow, marker) {
        return function() {
            if( prev_infowindow ) {
                prev_infowindow.close();
            }
            prev_infowindow = infowindow;
            infowindow.open(map, marker)
        };
    }

    /*
    Make the markers for each park object
     */
    function setMarkers(parkObjects) {
        for (var i = 0; i < parkObjects.length; i++) {

            var infowindow = [];
            var marker = [];

            var $infoWindowContent = $([
                '<div class="infoWindowContent">',
                '<p><b>' + parkObjects[i].name + '</b></p>',
                '<p>' + parkObjects[i].streetNumber + " " + parkObjects[i].streetName + '</p>',
                '<p><a class="btn btn-dark" href="#/park/' + parkObjects[i].name + '">' + "View this park!" +'</a></p>',
                '<button class="btn btn-dark routeHere">Route to here</button>',
                '</div>'
            ].join(''));
            $infoWindowContent.find(".routeHere").on('click', function() {
                calcRoute();
            });

            infowindow[i] = new google.maps.InfoWindow();
            infowindow[i].setContent($infoWindowContent.get(0));

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
            }); //end addListener

            google.maps.event.addListener(marker[i], 'click', makeInfoWindow($scope.mymap, infowindow[i], marker[i]));
            markersArray.push(marker[i]);
        }
    }

    //Find parks based on the user's search
    $scope.findPark = function(parkName) {

        if (parkName == undefined) {
            alert("Please enter a park name!");
            return;
        }

        clearOverlays();
        directionsDisplay.setMap(homeMap);
        console.log(parkName);
        $http.post("/search" + parkName, {name: parkName}).success(function(park) {

            $scope.parksSearched = park;

            //see if park exists
            try {
                setMarkers(park);
                $scope.mymap.panTo(markersArray[0].getPosition());
            } catch(err) {
                //if park does not exist
                alert("Sorry! We couldn't find a park named " + parkName);
            }

        })
    };

    /*
    Find all parks
     */
    $scope.findAllParks = function() {
        directionsDisplay.setMap(homeMap);
        $http.get("/home");
    };

    /*
    Look for a random park
     */
    $scope.findRandomPark = function() {
        directionsDisplay.setMap(homeMap);
            clearOverlays();

            var randNum = Math.floor((Math.random() * $scope.parks.length - 1));
            var randPark = [$scope.parks[randNum]];
            $scope.parksSearched = randPark;

            setMarkers(randPark);
            $scope.mymap.panTo(markersArray[0].getPosition());

    };

    /*
    Find the closest park to user
     */
    $scope.findClosestPark = function() {
        directionsDisplay.setMap(homeMap);

            var parkLat = [];
            var parkLon = [];
            var currentLat;
            var currentLon;
            var distanceToParks = [];
            var closestPark = [];


            function onPositionUpdate(position)
            {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;

                    clearOverlays();
                    console.log("ssup jr2");
                    console.log($scope.parks[3]);
                    for(var w = 0; w < $scope.parks.length; w++) {
                        parkLat[w] = $scope.parks[w].lat;
                        parkLon[w] = $scope.parks[w].lon;
                        distanceToParks[w] = $scope.getDistance(currentLat, currentLon, parkLat[w], parkLon[w]);
                    }

                    console.log(parkLat[3], parkLon[3]);
                    console.log(distanceToParks[5], distanceToParks[6]);

                    var closestParkIndex = distanceToParks.indexOf(Math.min.apply(Math, distanceToParks));
                    console.log(closestParkIndex);
                    closestPark[0] = $scope.parks[closestParkIndex];
                    console.log(closestPark);
                    $scope.parksSearched = closestPark;

                    setMarkers(closestPark);
                    $scope.mymap.panTo(markersArray[0].getPosition());
            }

            if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(onPositionUpdate);
            else
                alert("navigator.geolocation is not available");
    };




    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();


    /*
    Shows the route from the user's current location to their destination park
     */
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

    /*
    Returns the shortest distance from two places
     */
    $scope.getDistance = function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344; }
        if (unit=="N") { dist = dist * 0.8684; }
        return dist;
    };

}]);